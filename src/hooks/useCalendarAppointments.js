// src/hooks/useCalendarAppointments.js
import { useState, useEffect, useCallback, useRef } from "react";
import { fetchCalendarAppointments } from "../services/calendar";
import { groupAppointmentsByDate } from "../utils/calendarGrid";

export default function useCalendarAppointments(
  month,
  branchId = null,
  statusFilter = "all",
) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const loadAppointments = useCallback(async () => {
    console.log(
      "🔄 loadAppointments called with branchId:",
      branchId,
      "statusFilter:",
      statusFilter,
    );
    if (!isMounted.current) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCalendarAppointments(
        month,
        branchId,
        statusFilter,
      );
      if (isMounted.current) {
        setAppointments(data);
      }
    } catch (err) {
      console.error("Error loading calendar appointments:", err);
      if (isMounted.current) {
        setError(err.message || "Failed to load appointments");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [branchId, statusFilter, month]);

  useEffect(() => {
    isMounted.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAppointments();
    return () => {
      isMounted.current = false;
    };
  }, [loadAppointments]);

  const appointmentsByDate = groupAppointmentsByDate(appointments);

  return { appointmentsByDate, loading, error, refetch: loadAppointments };
}
