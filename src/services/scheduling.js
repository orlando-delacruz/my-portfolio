// src/services/scheduling.js
import { supabase } from "./supabase/supabase";
import dayjs from "dayjs";

// ── Simple in‑memory cache for operating hours ──
const operatingHoursCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get operating hours for a branch on a specific date (cached).
 */
export async function getOperatingHoursForBranchDate(branchId, date) {
  if (!branchId || !date) return null;
  const dayOfWeek = dayjs(date).day();
  const key = `${branchId}-${dayOfWeek}`;
  const cached = operatingHoursCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const { data, error } = await supabase
    .from("operating_hours")
    .select("open_time, close_time, is_closed")
    .eq("branch_id", branchId)
    .eq("day_of_week", dayOfWeek)
    .maybeSingle();

  if (error) {
    console.error("[scheduling] Error fetching operating hours:", error);
    operatingHoursCache.set(key, { data: null, timestamp: Date.now() });
    return null;
  }

  operatingHoursCache.set(key, { data, timestamp: Date.now() });
  return data;
}

/**
 * Check if a specific date has a clinic closure that affects booking.
 */
export async function getClosureForDate(branchId, date) {
  if (!branchId || !date) return null;
  const dateStr = dayjs(date).format("YYYY-MM-DD");
  const { data, error } = await supabase
    .from("clinic_closures")
    .select("id, is_all_day, start_time, end_time")
    .eq("branch_id", branchId)
    .eq("is_cancelled", false)
    .eq("affects_booking", true)
    .lte("start_date", dateStr)
    .gte("end_date", dateStr)
    .maybeSingle();

  if (error) {
    console.error("[scheduling] Error checking clinic closure:", error);
    return null;
  }
  return data;
}

/**
 * Get confirmed appointments for a specific date and branch.
 * Returns an array of time strings in "HH:mm:ss" format.
 */
export async function getConfirmedAppointmentsForDate(branchId, date, excludeAppointmentId = null) {
  const dateStr = dayjs(date).format("YYYY-MM-DD");
  let query = supabase
    .from("appointments")
    .select(`
      confirmed_time,
      preferred_time,
      service_branch_id,
      service_branches!inner(branch_id)
    `)
    .eq("approval_status", "approved")
    .eq("appointment_status", "scheduled")
    .or(`confirmed_date.eq.${dateStr},preferred_date.eq.${dateStr}`)
    .eq("service_branches.branch_id", branchId);

  if (excludeAppointmentId) {
    query = query.neq("id", excludeAppointmentId);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[scheduling] Error fetching appointments:", error);
    return [];
  }
  return data.map((apt) => apt.confirmed_time || apt.preferred_time);
}

/**
 * Check if the clinic is closed on a specific date.
 * (Uses cached operating hours and closure check)
 */
export async function isDateClosed(branchId, date) {
  const hours = await getOperatingHoursForBranchDate(branchId, date);
  if (hours && hours.is_closed) return true;
  const closure = await getClosureForDate(branchId, date);
  return !!closure;
}

/**
 * Generate available time slots for a given date and branch.
 * Uses fixed clinic hours: 9:00 AM – 5:00 PM, 15‑minute intervals.
 * Returns an array of { value: "HH:mm:ss", disabled: boolean }.
 */
export async function generateAvailableSlots(branchId, date, excludeAppointmentId = null) {
  if (!branchId || !date) return [];

  // 1. Fetch operating hours, closure, and appointments in parallel
  const [hours, closure, bookedTimes] = await Promise.all([
    getOperatingHoursForBranchDate(branchId, date),
    getClosureForDate(branchId, date),
    getConfirmedAppointmentsForDate(branchId, date, excludeAppointmentId),
  ]);

  // 2. If the clinic is closed (operating hours closed or closure exists), return no slots
  if ((hours && hours.is_closed) || closure) return [];

  // 3. Fixed operating hours (9:00 AM – 5:00 PM)
  const intervalMinutes = 15;
  const openMin = 9 * 60;        // 9:00 AM = 540 minutes
  const closeMin = 17 * 60;      // 5:00 PM = 1020 minutes

  // 4. Booked times as minutes
  const bookedMinutes = bookedTimes.map((t) => timeToMinutes(t)).filter((m) => !isNaN(m));

  // 5. Generate slots
  const slots = [];
  const now = dayjs();
  const isToday = date.isSame(now, 'day');
  // Current time in minutes (without rounding)
  const nowMinutes = isToday ? now.hour() * 60 + now.minute() : null;

  let current = openMin;
  while (current + intervalMinutes <= closeMin) {
    // Check if this slot conflicts with a booked appointment
    const hasConflict = bookedMinutes.some((bookedMin) => {
      return (bookedMin >= current && bookedMin < current + intervalMinutes);
    });

    let disabled = hasConflict;

    // Disable if slot is in the past (strictly before current time) for today
    if (isToday && current < nowMinutes) {
      disabled = true;
    }

    slots.push({
      value: minutesToTime(current),
      disabled: disabled,
    });
    current += intervalMinutes;
  }
  return slots;
}

// ── Utilities ──
function timeToMinutes(timeStr) {
  if (!timeStr) return NaN;
  const parts = timeStr.split(":").map(Number);
  if (parts.length < 2) return NaN;
  return parts[0] * 60 + parts[1];
}

function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
}

/**
 * Determine which dates in a month are fully booked (no available slots).
 * Uses the same logic as generateAvailableSlots.
 */
export async function getFullyBookedDatesInMonth(branchId, monthDate) {
  if (!branchId || !monthDate) return [];
  const start = monthDate.startOf("month");
  const end = monthDate.endOf("month");
  const fullyBooked = [];

  let current = start.clone();
  while (current.isBefore(end) || current.isSame(end, "day")) {
    const closed = await isDateClosed(branchId, current);
    if (closed) {
      fullyBooked.push(current.format("YYYY-MM-DD"));
    } else {
      const slots = await generateAvailableSlots(branchId, current);
      const availableSlots = slots.filter((s) => !s.disabled);
      if (availableSlots.length === 0) {
        fullyBooked.push(current.format("YYYY-MM-DD"));
      }
    }
    current = current.add(1, "day");
  }
  return fullyBooked;
}