// src/hooks/useScheduling.js
import { useState, useEffect, useCallback, useRef } from "react";
import dayjs from "dayjs";
import { getOperatingHoursForDay, isDateClosed } from "../utils/scheduling";

export function useScheduling(branchId, selectedDate) {
  const [operatingHours, setOperatingHours] = useState(null);
  const [isClosed, setIsClosed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    async function loadSchedule() {
      if (!branchId || !selectedDate) {
        if (isMounted.current) {
          setOperatingHours(null);
          setIsClosed(false);
          setLoading(false);
          setError(null);
        }
        return;
      }

      if (isMounted.current) {
        setLoading(true);
        setError(null);
      }

      try {
        const hours = await getOperatingHoursForDay(branchId, selectedDate);
        const closed = await isDateClosed(branchId, selectedDate);

        if (isMounted.current) {
          setOperatingHours(hours);
          setIsClosed(closed || hours.isClosed);
          console.log("📅 Scheduling data:", {
            hours,
            closed,
            branchId,
            date: selectedDate,
          });
        }
      } catch (err) {
        console.error("❌ Error fetching schedule:", err);
        if (isMounted.current) {
          setError(err.message || "Failed to load schedule");
          // ✅ FALLBACK: use default hours so UI works
          setOperatingHours({
            isClosed: false,
            openTime: "10:30:00",
            closeTime: "17:00:00",
          });
          setIsClosed(false);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    }

    loadSchedule();
  }, [branchId, selectedDate]);

  const disabledTime = useCallback(() => {
    // Use default hours if operatingHours is null (e.g., loading or no data)
    const hours = operatingHours || {
      isClosed: false,
      openTime: "10:30:00",
      closeTime: "17:00:00",
    };

    if (hours.isClosed || isClosed) {
      return {
        disabledHours: () => Array.from({ length: 24 }, (_, i) => i),
        disabledMinutes: () => [],
      };
    }

    const openHour = dayjs(hours.openTime, "HH:mm:ss").hour();
    const openMinute = dayjs(hours.openTime, "HH:mm:ss").minute();
    const closeHour = dayjs(hours.closeTime, "HH:mm:ss").hour();
    const closeMinute = dayjs(hours.closeTime, "HH:mm:ss").minute();

    return {
      disabledHours: () => {
        const hrs = [];
        for (let h = 0; h < 24; h++) {
          if (h < openHour || h > closeHour) hrs.push(h);
          if (h === closeHour && closeMinute === 0) hrs.push(h);
        }
        return hrs;
      },
      disabledMinutes: (h) => {
        if (h === openHour) {
          return Array.from({ length: openMinute }, (_, i) => i);
        }
        if (h === closeHour) {
          return Array.from(
            { length: 60 - closeMinute },
            (_, i) => closeMinute + i,
          );
        }
        return [];
      },
    };
  }, [operatingHours, isClosed]);

  return { isClosed, disabledTime, loading, error };
}
