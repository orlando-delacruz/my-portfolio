// src/services/scheduling.js
import { supabase } from "./supabase/supabase";
import dayjs from "dayjs";

const DEFAULT_INTERVAL = 30;

/**
 * Get confirmed appointments for a specific date and branch.
 * @param {string} branchId
 * @param {dayjs} date
 * @returns {Array<string>} times in "HH:mm:ss" format
 */
export async function getConfirmedAppointmentsForDate(branchId, date) {
  const dateStr = dayjs(date).format("YYYY-MM-DD");

  // Use inner join with service_branches to filter by branch_id
  const { data, error } = await supabase
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

  if (error) {
    console.error("[scheduling] Error fetching appointments:", error);
    return [];
  }

  // Extract times from the returned data
  const times = data.map((apt) => apt.confirmed_time || apt.preferred_time);
  return times;
}

/**
 * Get operating hours for a branch on a specific date.
 */
export async function getOperatingHoursForBranchDate(branchId, date) {
  const dayOfWeek = dayjs(date).day();
  const { data, error } = await supabase
    .from("operating_hours")
    .select("open_time, close_time, is_closed")
    .eq("branch_id", branchId)
    .eq("day_of_week", dayOfWeek)
    .maybeSingle();

  if (error) {
    console.error("[scheduling] Error fetching operating hours:", error);
    return null;
  }
  return data;
}

/**
 * Check if the clinic is closed on a specific date for a given branch.
 */
export async function isDateClosed(branchId, date) {
  if (!branchId || !date) return false;

  const hours = await getOperatingHoursForBranchDate(branchId, date);
  if (hours && hours.is_closed) return true;

  const dateStr = dayjs(date).format("YYYY-MM-DD");
  const { data, error } = await supabase
    .from("clinic_closures")
    .select("id")
    .eq("branch_id", branchId)
    .eq("is_cancelled", false)
    .eq("affects_booking", true)
    .lte("start_date", dateStr)
    .gte("end_date", dateStr)
    .maybeSingle();

  if (error) {
    console.error("[scheduling] Error checking clinic closure:", error);
    return false;
  }
  return !!data;
}

/**
 * Generate available time slots for a given date and branch,
 * using the provided interval (in minutes).
 */
export async function generateAvailableSlots(
  branchId,
  date,
  intervalMinutes = DEFAULT_INTERVAL
) {
  if (!branchId || !date) return [];

  const hoursData = await getOperatingHoursForBranchDate(branchId, date);
  if (!hoursData || hoursData.is_closed) return [];

  let openMin = timeToMinutes(hoursData.open_time);
  let closeMin = timeToMinutes(hoursData.close_time);
  if (isNaN(openMin) || isNaN(closeMin) || openMin >= closeMin) return [];

  const bookedTimes = await getConfirmedAppointmentsForDate(branchId, date);
  const bookedMinutes = bookedTimes.map((t) => timeToMinutes(t)).filter((m) => !isNaN(m));

  const slots = [];
  let current = openMin;
  while (current + intervalMinutes <= closeMin) {
    const hasConflict = bookedMinutes.some((bookedMin) => {
      return (bookedMin >= current && bookedMin < current + intervalMinutes);
    });
    if (!hasConflict) {
      slots.push(minutesToTime(current));
    }
    current += intervalMinutes;
  }
  return slots;
}

/**
 * Get disabled hours/minutes for TimePicker.
 */
export async function getDisabledTimes(
  branchId,
  date,
  intervalMinutes = DEFAULT_INTERVAL
) {
  const hoursData = await getOperatingHoursForBranchDate(branchId, date);
  if (!hoursData || hoursData.is_closed) {
    return {
      disabledHours: () => Array.from({ length: 24 }, (_, i) => i),
      disabledMinutes: () => [],
    };
  }

  const openMin = timeToMinutes(hoursData.open_time);
  const closeMin = timeToMinutes(hoursData.close_time);
  if (isNaN(openMin) || isNaN(closeMin) || openMin >= closeMin) {
    return {
      disabledHours: () => Array.from({ length: 24 }, (_, i) => i),
      disabledMinutes: () => [],
    };
  }

  const bookedTimes = await getConfirmedAppointmentsForDate(branchId, date);
  const bookedMinutes = bookedTimes.map((t) => timeToMinutes(t)).filter((m) => !isNaN(m));

  const disabledMinutesSet = new Set();
  for (let m = 0; m < 24 * 60; m++) {
    if (m < openMin || m >= closeMin) {
      disabledMinutesSet.add(m);
    }
    for (const bookedMin of bookedMinutes) {
      if (m >= bookedMin && m < bookedMin + intervalMinutes) {
        disabledMinutesSet.add(m);
      }
    }
  }

  const disabledHours = [];
  const disabledMinutesByHour = {};
  for (let h = 0; h < 24; h++) {
    const start = h * 60;
    const end = start + 60;
    const minutes = [];
    for (let m = start; m < end; m++) {
      if (disabledMinutesSet.has(m)) {
        minutes.push(m - start);
      }
    }
    if (minutes.length === 60) {
      disabledHours.push(h);
    } else {
      disabledMinutesByHour[h] = minutes;
    }
  }

  return {
    disabledHours: () => disabledHours,
    disabledMinutes: (h) => disabledMinutesByHour[h] || [],
  };
}

/**
 * Determine which dates in a given month are fully booked (no available slots).
 * @param {string} branchId
 * @param {dayjs} monthDate - any date within the month
 * @param {number} intervalMinutes - appointment interval
 * @returns {string[]} array of "YYYY-MM-DD" strings for fully booked dates
 */
export async function getFullyBookedDatesInMonth(
  branchId,
  monthDate,
  intervalMinutes = DEFAULT_INTERVAL
) {
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
      const slots = await generateAvailableSlots(branchId, current, intervalMinutes);
      if (slots.length === 0) {
        fullyBooked.push(current.format("YYYY-MM-DD"));
      }
    }
    current = current.add(1, "day");
  }
  return fullyBooked;
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