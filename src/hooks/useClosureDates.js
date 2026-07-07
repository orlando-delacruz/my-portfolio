// src/hooks/useClosureDates.js
import { useEffect, useReducer } from 'react';
import dayjs from 'dayjs';
import { fetchClosureRangesForMonth } from '../services/clinicClosures';

// ── Reducer ──
const initialState = {
  closedDates: new Set(),
  closureDetails: {},
  loading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        loading: false,
        closedDates: action.payload.closedDates,
        closureDetails: action.payload.closureDetails,
      };
    case 'FETCH_ERROR':
      return { ...state, loading: false, closedDates: new Set(), closureDetails: {} };
    default:
      return state;
  }
}

export function useClosureDates(branchId, monthDate) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { closedDates, closureDetails, loading } = state;

  useEffect(() => {
    // Ensure monthDate is a valid Day.js object
    const month = monthDate && typeof monthDate === 'object' && monthDate.isValid
      ? monthDate
      : dayjs(monthDate);

    console.log('[useClosureDates] branchId:', branchId, 'monthDate:', month ? month.format('YYYY-MM-DD') : 'null');

    if (!month || !month.isValid()) {
      // If no valid month, reset state
      dispatch({ type: 'FETCH_SUCCESS', payload: { closedDates: new Set(), closureDetails: {} } });
      return;
    }

    let isMounted = true;
    dispatch({ type: 'FETCH_START' });

    const fetchData = async () => {
      try {
        const closures = await fetchClosureRangesForMonth(branchId, month);
        if (!isMounted) return;

        const dateSet = new Set();
        const detailsMap = {};

        closures.forEach((closure) => {
          const start = dayjs(closure.start_date);
          const end = dayjs(closure.end_date);
          let current = start;
          while (current.isBefore(end) || current.isSame(end, 'day')) {
            const dateStr = current.format('YYYY-MM-DD');
            dateSet.add(dateStr);
            if (!detailsMap[dateStr]) {
              detailsMap[dateStr] = closure.title || 'Clinic Closed';
            }
            current = current.add(1, 'day');
          }
        });

        console.log('[useClosureDates] closedDates:', Array.from(dateSet));
        console.log('[useClosureDates] closureDetails:', detailsMap);

        if (isMounted) {
          dispatch({
            type: 'FETCH_SUCCESS',
            payload: { closedDates: dateSet, closureDetails: detailsMap },
          });
        }
      } catch (err) {
        console.error('Failed to fetch closure dates:', err);
        if (isMounted) {
          dispatch({ type: 'FETCH_ERROR' });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [branchId, monthDate]);

  return { closedDates, closureDetails, loading };
}