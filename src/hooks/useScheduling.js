// src/hooks/useScheduling.js
import { useState, useEffect, useCallback, useRef } from "react";
import dayjs from "dayjs";
import { getOperatingHoursForBranchDate, isDateClosed } from "../services/scheduling";

function timeToMinutes(timeStr) {
  if (!timeStr) return NaN;
  const parts = timeStr.split(":").map(Number);
  if (parts.length < 2) return NaN;
  return parts[0] * 60 + parts[1];
}

function computeDisabledTimes(hours) {
  if (!hours || hours.is_closed) {
    const allHours = Array.from({ length: 24 }, (_, i) => i);
    return { disabledHours: allHours, disabledMinutesByHour: {} };
  }

  const openMin = timeToMinutes(hours.open_time);
  const closeMin = timeToMinutes(hours.close_time);
  if (isNaN(openMin) || isNaN(closeMin) || openMin >= closeMin) {
    const allHours = Array.from({ length: 24 }, (_, i) => i);
    return { disabledHours: allHours, disabledMinutesByHour: {} };
  }

  const disabledMinutesSet = new Set();
  for (let m = 0; m < 24 * 60; m++) {
    if (m < openMin || m >= closeMin) {
      disabledMinutesSet.add(m);
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

  return { disabledHours, disabledMinutesByHour };
}

export function useScheduling(branchId, selectedDate) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClosed, setIsClosed] = useState(false);
  const [disabledHours, setDisabledHours] = useState([]);
  const [disabledMinutesByHour, setDisabledMinutesByHour] = useState({});
  const [schedulingVersion, setSchedulingVersion] = useState(0);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const dateKey = selectedDate ? selectedDate.format("YYYY-MM-DD") : null;

  useEffect(() => {
    const compute = async () => {
      if (!branchId || !dateKey) {
        if (isMounted.current) {
          setDisabledHours([]);
          setDisabledMinutesByHour({});
          setIsClosed(false);
          setLoading(false);
          setSchedulingVersion(prev => prev + 1);
        }
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const dateObj = dayjs(dateKey);
        const hours = await getOperatingHoursForBranchDate(branchId, dateObj);
        const closed = await isDateClosed(branchId, dateObj);
        setIsClosed(closed || (hours && hours.is_closed));

        if (closed || (hours && hours.is_closed)) {
          const allHours = Array.from({ length: 24 }, (_, i) => i);
          setDisabledHours(allHours);
          setDisabledMinutesByHour({});
          setSchedulingVersion(prev => prev + 1);
          setLoading(false);
          return;
        }

        const { disabledHours: dHours, disabledMinutesByHour: dMinutes } = computeDisabledTimes(hours);

        if (isMounted.current) {
          setDisabledHours(dHours);
          setDisabledMinutesByHour(dMinutes);
          setSchedulingVersion(prev => prev + 1);
        }
      } catch (err) {
        console.error("❌ Error fetching schedule:", err);
        if (isMounted.current) {
          setError(err.message || "Failed to load schedule");
          setDisabledHours([]);
          setDisabledMinutesByHour({});
          setSchedulingVersion(prev => prev + 1);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    compute();
  }, [branchId, dateKey]);

  const disabledTime = useCallback(() => {
    return {
      disabledHours: () => disabledHours,
      disabledMinutes: (hour) => disabledMinutesByHour[hour] || [],
    };
  }, [disabledHours, disabledMinutesByHour]);

  return {
    isClosed,
    disabledTime,
    schedulingVersion,
    loading,
    error,
  };
}