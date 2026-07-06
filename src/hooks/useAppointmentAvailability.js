// src/hooks/useAppointmentAvailability.js
import { useEffect, useCallback, useMemo, useReducer } from "react";
import dayjs from "dayjs";
import { useScheduling } from "./useScheduling";
import { getFullyBookedDatesInMonth } from "../services/scheduling";

import { supabase } from "../services/supabase/supabase";
import useSettingsStore from "../store/useSettingsStore";

// ── Reducer ──
const FETCH_ACTIONS = {
  START: "START",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

function fetchReducer(state, action) {
  switch (action.type) {
    case FETCH_ACTIONS.START:
      return { ...state, loading: true, error: null };
    case FETCH_ACTIONS.SUCCESS:
      return {
        loading: false,
        error: null,
        closures: action.payload.closures,
        fullyBooked: action.payload.fullyBooked,
      };
    case FETCH_ACTIONS.ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const INITIAL_FETCH_STATE = {
  loading: false,
  error: null,
  closures: [],
  fullyBooked: [],
};

export function useAppointmentAvailability(branchId, selectedDateKey, monthKey) {
  // 1. Operating hours from the store
  const storeOperatingHours = useSettingsStore((state) => state.operatingHours);

  // 2. Build operatingHoursMap from store data (derived – no state/effect)
  const operatingHoursMap = useMemo(() => {
    if (!branchId || !storeOperatingHours[branchId] || storeOperatingHours[branchId].length === 0) {
      return {};
    }
    const map = {};
    storeOperatingHours[branchId].forEach((hour) => {
      map[hour.dayOfWeek] = hour;
    });
    return map;
  }, [branchId, storeOperatingHours]);

  // 3. Scheduling (for time slot generation)
  const selectedDate = useMemo(() => {
    return selectedDateKey ? dayjs(selectedDateKey) : null;
  }, [selectedDateKey]);

  const { disabledTime, loading: schedulingLoading, error: schedulingError } =
    useScheduling(branchId, selectedDate);

  // 4. Reducer for closures & fully booked dates
  const [fetchState, dispatch] = useReducer(fetchReducer, INITIAL_FETCH_STATE);

  // 5. Stable month key – already a string from the caller
  const stableMonthKey = monthKey;

  // 6. Fetch closures and fully booked dates
  useEffect(() => {
    if (!branchId || !stableMonthKey) {
      dispatch({
        type: FETCH_ACTIONS.SUCCESS,
        payload: { closures: [], fullyBooked: [] },
      });
      return;
    }

    const monthDate = dayjs(stableMonthKey + "-01");
    const monthStart = monthDate.startOf("month").format("YYYY-MM-DD");
    const monthEnd = monthDate.endOf("month").format("YYYY-MM-DD");

    let isMounted = true;
    const abortController = new AbortController();

    dispatch({ type: FETCH_ACTIONS.START });

    const fetchData = async () => {
      try {
        const { data: closuresData, error: closureError } = await supabase
          .from("clinic_closures")
          .select("start_date, end_date")
          .eq("branch_id", branchId)
          .eq("is_cancelled", false)
          .eq("affects_booking", true)
          .or(`start_date.lte.${monthEnd},end_date.gte.${monthStart}`)
          .abortSignal(abortController.signal);

        if (closureError) throw closureError;

        const fullyBookedData = await getFullyBookedDatesInMonth(branchId, monthDate);

        if (isMounted) {
          dispatch({
            type: FETCH_ACTIONS.SUCCESS,
            payload: {
              closures: closuresData || [],
              fullyBooked: fullyBookedData || [],
            },
          });
        }
      } catch (err) {
        if (isMounted && err.name !== "AbortError") {
          dispatch({
            type: FETCH_ACTIONS.ERROR,
            payload: err.message || "Failed to load availability data",
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [branchId, stableMonthKey]);

  // 7. Helpers
  const isClosureDate = useCallback(
    (dateStr) => {
      return fetchState.closures.some((c) => {
        const start = dayjs(c.start_date);
        const end = dayjs(c.end_date);
        const d = dayjs(dateStr);
        return d.isBetween(start, end, "day", "[]");
      });
    },
    [fetchState.closures]
  );

  const isFullyBookedDate = useCallback(
    (dateStr) => {
      return fetchState.fullyBooked.includes(dateStr);
    },
    [fetchState.fullyBooked]
  );

  // 8. Derived statuses for the selected date
  const isSelectedDateClosed = useMemo(() => {
    if (!selectedDateKey || !branchId) return false;
    if (isClosureDate(selectedDateKey)) return true;
    const dayOfWeek = dayjs(selectedDateKey).day();
    const hours = operatingHoursMap[dayOfWeek];
    return hours && hours.isClosed;
  }, [selectedDateKey, branchId, isClosureDate, operatingHoursMap]);

  const isDateFullyBooked = useMemo(() => {
    if (!selectedDateKey || !branchId) return false;
    return isFullyBookedDate(selectedDateKey);
  }, [selectedDateKey, branchId, isFullyBookedDate]);

  const loading = schedulingLoading || fetchState.loading;
  const error = schedulingError || fetchState.error;

  return {
    disabledTime,
    isDateFullyBooked,
    isSelectedDateClosed,
    loading,
    error,
  };
}