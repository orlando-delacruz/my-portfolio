// src/services/scheduling.js
import { supabase } from "./supabase/supabase";
import dayjs from "dayjs";

const MIN_INTERVAL_MINUTES = 60;

function timeToMinutes(timeStr) {
  if (!timeStr) return NaN;
  const parts = timeStr.split(":").map(Number);
  if (parts.length < 2) return NaN;
  const h = parts[0];
  const m = parts[1];
  if (isNaN(h) || isNaN(m)) return NaN;
  return h * 60 + m;
}

/**
 * Get confirmed appointments for a specific date across ALL branches.
 * @param {string} branchId - ignored (kept for API compatibility)
 * @param {dayjs} date - the date to check
 * @returns {Array<string>} times in "HH:mm:ss" format
 */
export async function getConfirmedAppointmentsForDate(branchId, date) {
  const dateStr = dayjs(date).format("YYYY-MM-DD");

  // Query all appointments for the date, regardless of branch
  const { data, error } = await supabase
    .from("appointments")
    .select("confirmed_time, preferred_time")
    .eq("approval_status", "approved")
    .eq("appointment_status", "scheduled")
    .or(`confirmed_date.eq.${dateStr},preferred_date.eq.${dateStr}`);

  if (error) {
    console.error("[scheduling] Error fetching appointments:", error);
    return [];
  }

  const times = data.map((apt) => apt.confirmed_time || apt.preferred_time);
  console.log(
    `[scheduling] Global confirmed appointments for ${dateStr}:`,
    times,
  );
  return times;
}

/**
 * Get operating hours for a branch on a specific date (branch-specific).
 * This still respects branch-specific hours because each branch may have different hours.
 * @param {string} branchId - the branch to get hours for
 * @param {dayjs} date - the date
 * @returns {Object} { isClosed, openMinutes, closeMinutes }
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
 * Check if there is any available slot globally on a given date.
 * @param {string} branchId - ignored for conflict checking, used only for operating hours.
 * @param {dayjs} date - the date
 * @returns {boolean} true if any slot is available globally
 */
export async function hasAvailableSlot(branchId, date) {
  const hoursData = await getOperatingHoursForBranchDate(branchId, date);
  let openMin = 10 * 60 + 30; // 10:30 AM default
  let closeMin = 17 * 60; // 5:00 PM default
  if (
    hoursData &&
    !hoursData.is_closed &&
    hoursData.open_time &&
    hoursData.close_time
  ) {
    const o = timeToMinutes(hoursData.open_time);
    const c = timeToMinutes(hoursData.close_time);
    if (!isNaN(o) && !isNaN(c)) {
      openMin = o;
      closeMin = c;
    }
  }
  if (isNaN(openMin) || isNaN(closeMin) || (hoursData && hoursData.is_closed)) {
    return false;
  }

  // Get global appointments
  const appointmentMinutes = await getConfirmedAppointmentsForDate(null, date);
  const sortedMinutes = appointmentMinutes
    .map((t) => timeToMinutes(t))
    .filter((m) => !isNaN(m))
    .sort((a, b) => a - b);

  let current = openMin;
  for (const aptMin of sortedMinutes) {
    if (aptMin - current >= MIN_INTERVAL_MINUTES) {
      return true;
    }
    current = aptMin + MIN_INTERVAL_MINUTES;
  }
  return closeMin - current >= MIN_INTERVAL_MINUTES;
}

/**
 * Get disabled hours and minutes for TimePicker (global conflicts).
 * @param {string} branchId - ignored for conflicts, used for operating hours
 * @param {dayjs} date - the date
 * @returns {Object} { disabledHours: () => [...], disabledMinutes: (h) => [...] }
 */
export async function getDisabledTimes(branchId, date) {
  const hoursData = await getOperatingHoursForBranchDate(branchId, date);

  let openMin = 10 * 60 + 30; // 10:30 AM default
  let closeMin = 17 * 60; // 5:00 PM default
  let isClosed = false;

  if (hoursData) {
    if (hoursData.is_closed) {
      isClosed = true;
    } else if (hoursData.open_time && hoursData.close_time) {
      const o = timeToMinutes(hoursData.open_time);
      const c = timeToMinutes(hoursData.close_time);
      if (!isNaN(o) && !isNaN(c)) {
        openMin = o;
        closeMin = c;
      }
    }
  }

  if (isClosed || openMin >= closeMin) {
    return {
      disabledHours: () => Array.from({ length: 24 }, (_, i) => i),
      disabledMinutes: () => [],
    };
  }

  // Global appointments
  const appointmentMinutes = await getConfirmedAppointmentsForDate(null, date);
  const sortedMinutes = appointmentMinutes
    .map((t) => timeToMinutes(t))
    .filter((m) => !isNaN(m))
    .sort((a, b) => a - b);

  const conflictDisabledSet = new Set();
  for (let m = openMin; m < closeMin; m++) {
    const isDisabled = sortedMinutes.some(
      (aptMin) => Math.abs(aptMin - m) < MIN_INTERVAL_MINUTES,
    );
    if (isDisabled) {
      conflictDisabledSet.add(m);
    }
  }

  const disabledHours = [];
  const disabledMinutesByHour = {};

  for (let h = 0; h < 24; h++) {
    const start = h * 60;
    const end = start + 60;
    const hourStart = start;
    const hourEnd = end - 1;
    const disabledMinutes = [];

    if (hourEnd < openMin || hourStart >= closeMin) {
      disabledHours.push(h);
      continue;
    }

    for (let m = start; m < end; m++) {
      if (m < openMin || m >= closeMin) {
        disabledMinutes.push(m - start);
      } else if (conflictDisabledSet.has(m)) {
        disabledMinutes.push(m - start);
      }
    }

    if (disabledMinutes.length === 60) {
      disabledHours.push(h);
    } else {
      disabledMinutesByHour[h] = disabledMinutes;
    }
  }

  return {
    disabledHours: () => disabledHours,
    disabledMinutes: (h) => disabledMinutesByHour[h] || [],
  };
}
