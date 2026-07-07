// src/hooks/useCalendarIndicators.js
import { useMemo } from 'react';
import { useClosureDates } from './useClosureDates';
import { getRecurringEvents } from '../utils/calendarHelpers';

/**
 * Combines clinic closures and recurring weekly events into a single set of indicators per date.
 * @param {string} branchId - selected branch ID.
 * @param {dayjs} monthDate - the month to display.
 * @returns {Object} { indicators: Map<string, Array<{ title: string, type: string }>>, loading: boolean }
 */
export function useCalendarIndicators(branchId, monthDate) {
  // Fetch clinic closures
  const { closedDates, closureDetails, loading: closureLoading } = useClosureDates(branchId, monthDate);

  // Generate recurring events
  const recurringEvents = useMemo(() => {
    if (!monthDate) return [];
    return getRecurringEvents(monthDate);
  }, [monthDate]);

  // Build a map of date -> array of indicators
  const indicators = useMemo(() => {
    const map = new Map();

    // Add clinic closures
    if (closedDates && closureDetails) {
      for (const date of closedDates) {
        const title = closureDetails[date] || 'Clinic Closed';
        const indicatorsForDate = map.get(date) || [];
        indicatorsForDate.push({ title, type: 'closure' });
        map.set(date, indicatorsForDate);
      }
    }

    // Add recurring events (if the date is not already a closure, or add both)
    recurringEvents.forEach(event => {
      const indicatorsForDate = map.get(event.date) || [];
      // Avoid duplicates if the same date already has a closure (but we want both)
      // Check if an indicator with same type already exists (optional)
      // For now, just add the recurring event even if closure exists
      indicatorsForDate.push({ title: event.title, type: event.type });
      map.set(event.date, indicatorsForDate);
    });

    return map;
  }, [closedDates, closureDetails, recurringEvents]);

  return {
    indicators,
    loading: closureLoading,
  };
}