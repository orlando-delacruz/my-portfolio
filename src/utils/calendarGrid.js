// src\utils\calendarGrid.js

/**
 * Builds a 6x7 (or however many rows needed) calendar grid for a given month.
 * Each cell carries the date plus whether it belongs to the displayed month,
 * so the UI can grey out leading/trailing days.
 *
 * @param {Dayjs} monthDate — any date within the target month
 * @returns {{ date: Dayjs, isCurrentMonth: boolean }[]} flat array of day cells
 */
export function buildCalendarGrid(monthDate) {
  const startOfMonth = monthDate.startOf("month");
  const endOfMonth = monthDate.endOf("month");

  const gridStart = startOfMonth.startOf("week");
  const gridEnd = endOfMonth.endOf("week");

  const days = [];
  let cursor = gridStart;

  while (cursor.isBefore(gridEnd) || cursor.isSame(gridEnd, "day")) {
    days.push({
      date: cursor,
      isCurrentMonth: cursor.month() === monthDate.month(),
    });
    cursor = cursor.add(1, "day");
  }

  return days;
}

/**
 * Groups a flat appointments array by ISO date string for O(1) day lookups.
 * @param {Array<{date: string}>} appointments
 * @returns {Map<string, Array>}
 */
export function groupAppointmentsByDate(appointments) {
  const map = new Map();
  for (const appt of appointments) {
    const list = map.get(appt.date) ?? [];
    list.push(appt);
    map.set(appt.date, list);
  }
  return map;
}
