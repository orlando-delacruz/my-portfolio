import { useEffect, useState, useCallback } from "react";
import { supabase } from "../services/supabase/supabase";

export function useAppointments(branchId) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const refetch = useCallback(() => setFetchTrigger((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("appointments")
      .select(
        `
        *,
        branch:branches(id, name),
        status_history:appointment_status_history(
          id, old_status, new_status, changed_at,
          changed_by_user:users(full_name)
        )
      `,
      )
      .order("appointment_date", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setError(error);
        else setAppointments(data ?? []);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [branchId, fetchTrigger]);

  return { appointments, loading, error, refetch };
}
