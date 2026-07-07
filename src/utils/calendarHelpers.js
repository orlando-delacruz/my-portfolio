// src/utils/calendarHelpers.js

/**
 * Get all day numbers in a month that fall on a specific weekday.
 * @param {dayjs} monthDate - any date within the month.
 * @param {number} dayOfWeek - 0=Sunday, 1=Monday, ..., 6=Saturday.
 * @returns {number[]} array of day numbers (1-31).
 */
export function getDaysOfWeekInMonth(monthDate, dayOfWeek) {
  const start = monthDate.startOf('month');
  const end = monthDate.endOf('month');
  const days = [];
  let current = start.clone();
  while (current.isBefore(end) || current.isSame(end, 'day')) {
    if (current.day() === dayOfWeek) {
      days.push(current.date());
    }
    current = current.add(1, 'day');
  }
  return days;
}

/**
 * Generate recurring events for a given month.
 * @param {dayjs} monthDate - any date within the month.
 * @returns {Array<{ date: string, title: string, type: string }>}
 */
export function getRecurringEvents(monthDate) {
  const month = monthDate.startOf('month');
  const events = [];

  // Tuesdays (dayOfWeek = 2)
  const tuesdays = getDaysOfWeekInMonth(monthDate, 2);
  tuesdays.forEach(day => {
    const dateStr = month.clone().date(day).format('YYYY-MM-DD');
    events.push({
      date: dateStr,
      title: 'Day Off',
      type: 'day-off',
    });
  });

  // Saturdays (dayOfWeek = 6)
  const saturdays = getDaysOfWeekInMonth(monthDate, 6);
  saturdays.forEach(day => {
    const dateStr = month.clone().date(day).format('YYYY-MM-DD');
    events.push({
      date: dateStr,
      title: 'Sabbath Day',
      type: 'sabbath',
    });
  });

  return events;
}