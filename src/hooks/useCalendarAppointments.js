// src\hooks\useCalendarAppointments.js
import { useState, useEffect, useMemo } from "react";
import mockCalendarAppointments from "../data/admin/mockCalendarAppointments";
import { groupAppointmentsByDate } from "../utils/calendarGrid";

const SIMULATED_LATENCY_MS = 300;

/**
 * Front-end-only data hook for the Calendar page.
 * Simulates an async fetch (so loading/error states are exercised now and the
 * eventual Supabase-backed hook is a drop-in swap), then filters by branch
 * and groups results by date for fast day-cell lookups.
 *
 * @param {string} branchId — "" for all branches
 * @returns {{ appointmentsByDate: Map, loading: boolean, error: string|null }}
 */
export default function useCalendarAppointments(branchId) {
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(true); // start as true
  const [error, setError] = useState(null); // start as null

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(() => {
      if (cancelled) return;
      try {
        setAllAppointments(mockCalendarAppointments);
        setLoading(false); // update after success
        setError(null);
      } catch (err) {
        setError(err.message ?? "Failed to load appointments.");
        setLoading(false);
      }
    }, SIMULATED_LATENCY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []); // empty deps – run once on mount

  const filtered = useMemo(() => {
    if (!branchId) return allAppointments;
    return allAppointments.filter((a) => a.branchId === branchId);
  }, [allAppointments, branchId]);

  const appointmentsByDate = useMemo(
    () => groupAppointmentsByDate(filtered),
    [filtered],
  );

  return { appointmentsByDate, loading, error };
}
