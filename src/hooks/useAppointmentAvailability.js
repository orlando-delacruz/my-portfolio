// src/hooks/useAppointmentAvailability.js
import { useState, useEffect, useCallback, useRef } from "react";
import { hasAvailableSlot } from "../services/scheduling";

export function useAppointmentAvailability(branchId, selectedDate) {
  const [isDateFullyBooked, setIsDateFullyBooked] = useState(false);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Check if date is fully booked (based on available slots)
  useEffect(() => {
    async function checkAvailability() {
      if (!branchId || !selectedDate) {
        if (isMounted.current) {
          setIsDateFullyBooked(false);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const available = await hasAvailableSlot(branchId, selectedDate);
        if (isMounted.current) {
          setIsDateFullyBooked(!available);
        }
      } catch (err) {
        console.error("Error checking availability:", err);
        if (isMounted.current) {
          setIsDateFullyBooked(false);
        }
      } finally {
        if (isMounted.current) setLoading(false);
      }
    }

    checkAvailability();
  }, [branchId, selectedDate]);

  // Fixed disabledTime: always shows 10:30 AM to 5:00 PM
  const disabledTime = useCallback(() => {
    return {
      disabledHours: () => {
        const hours = [];
        for (let h = 0; h < 24; h++) {
          if (h < 10 || h > 17) hours.push(h);
        }
        return hours;
      },
      disabledMinutes: (h) => {
        if (h === 10) return Array.from({ length: 30 }, (_, i) => i);
        return [];
      },
    };
  }, []);

  // Date picker disabled dates: always return false (no dates disabled)
  const isDateDisabled = useCallback(() => {
    return false;
  }, []);

  return {
    disabledTime,
    isDateFullyBooked,
    loading,
    isDateDisabled,
  };
}
