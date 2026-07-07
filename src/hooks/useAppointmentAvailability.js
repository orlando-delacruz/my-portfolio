// src/hooks/useAppointmentAvailability.js
import { useEffect, useCallback, useMemo, useReducer, useRef } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useScheduling } from "./useScheduling";
import { getFullyBookedDatesInMonth } from "../services/scheduling";
import { supabase } from "../services/supabase/supabase";

dayjs.extend(isBetween);

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
        version: action.payload.version,
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
  version: 0,
};

export function useAppointmentAvailability(
  branchId,
  selectedDateKey,
  monthKey,
  durationMinutes = 30
) {
  const selectedDate = useMemo(() => {
    return selectedDateKey ? dayjs(selectedDateKey) : null;
  }, [selectedDateKey]);

  const {
    disabledTime,
    isClosed: schedulingIsClosed,
    schedulingVersion,
    loading: schedulingLoading,
    error: schedulingError,
  } = useScheduling(branchId, selectedDate);

  const [fetchState, dispatch] = useReducer(fetchReducer, INITIAL_FETCH_STATE);

  const stableMonthKey = monthKey;
  const versionRef = useRef(0);

  useEffect(() => {
    if (!branchId || !stableMonthKey) {
      dispatch({
        type: FETCH_ACTIONS.SUCCESS,
        payload: { closures: [], fullyBooked: [], version: versionRef.current++ },
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
          .select("*")
          .eq("branch_id", branchId)
          .eq("is_cancelled", false)
          .eq("affects_booking", true)
          .lte("start_date", monthEnd)
          .gte("end_date", monthStart)
          .abortSignal(abortController.signal);

        if (closureError) throw closureError;

        const fullyBookedData = await getFullyBookedDatesInMonth(branchId, monthDate, durationMinutes);

        if (isMounted) {
          dispatch({
            type: FETCH_ACTIONS.SUCCESS,
            payload: {
              closures: closuresData || [],
              fullyBooked: fullyBookedData || [],
              version: versionRef.current++,
            },
          });
        }
      } catch (err) {
        if (isMounted && err.name !== "AbortError") {
          console.error("❌ [useAppointmentAvailability] Error fetching closures:", err);
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
  }, [branchId, stableMonthKey, durationMinutes]);

  const isClosureDate = useCallback(
    (dateStr) => {
      if (!dateStr) return false;
      const selected = dayjs(dateStr);
      return fetchState.closures.some((c) => {
        const isAllDay = c.is_all_day === true || (!c.is_all_day && !c.start_time && !c.end_time);
        if (!isAllDay) return false;
        const start = dayjs(c.start_date);
        const end = dayjs(c.end_date);
        return selected.isBetween(start, end, 'day', '[]');
      });
    },
    [fetchState.closures]
  );

  const isDateFullyBooked = useCallback(
    (dateStr) => {
      return fetchState.fullyBooked.includes(dateStr);
    },
    [fetchState.fullyBooked]
  );

  const isSelectedDateClosed = useMemo(() => {
    if (!selectedDateKey || !branchId) return false;
    if (schedulingLoading) return false;
    if (schedulingIsClosed) return true;
    if (isClosureDate(selectedDateKey)) return true;
    return false;
  }, [selectedDateKey, branchId, schedulingIsClosed, schedulingLoading, isClosureDate]);

  const isDateFullyBookedSelected = useMemo(() => {
    if (!selectedDateKey || !branchId) return false;
    return isDateFullyBooked(selectedDateKey);
  }, [selectedDateKey, branchId, isDateFullyBooked]);

  const loading = schedulingLoading || fetchState.loading;
  const error = schedulingError || fetchState.error;

  return {
    disabledTime,
    isDateFullyBooked: isDateFullyBookedSelected,
    isSelectedDateClosed,
    isClosureDate,
    closureVersion: fetchState.version,
    schedulingVersion,
    loading,
    error,
  };
}