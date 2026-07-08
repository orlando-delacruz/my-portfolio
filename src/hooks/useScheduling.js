// src/hooks/useScheduling.js
import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { generateAvailableSlots, isDateClosed } from "../services/scheduling";

export function useScheduling(branchId, selectedDate, excludeAppointmentId = null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClosed, setIsClosed] = useState(false);
  const [allSlots, setAllSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
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
          setAllSlots([]);
          setAvailableSlots([]);
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
        const closed = await isDateClosed(branchId, dateObj);
        setIsClosed(closed);

        if (closed) {
          setAllSlots([]);
          setAvailableSlots([]);
          setSchedulingVersion(prev => prev + 1);
          setLoading(false);
          return;
        }

        const slots = await generateAvailableSlots(branchId, dateObj, excludeAppointmentId);
        if (isMounted.current) {
          setAllSlots(slots);
          setAvailableSlots(slots.filter((s) => !s.disabled));
          setSchedulingVersion(prev => prev + 1);
        }
      } catch (err) {
        console.error("❌ Error fetching schedule:", err);
        if (isMounted.current) {
          setError(err.message || "Failed to load schedule");
          setAllSlots([]);
          setAvailableSlots([]);
          setSchedulingVersion(prev => prev + 1);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    compute();
  }, [branchId, dateKey, excludeAppointmentId]);

  return {
    isClosed,
    allSlots,
    availableSlots,
    schedulingVersion,
    loading,
    error,
  };
}