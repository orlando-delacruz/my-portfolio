// src/hooks/useAppointments.js
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../services/supabase/supabase";

export function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const refetch = useCallback(() => setFetchTrigger((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    supabase
      .from("appointments")
      .select(
        `
        *,
        patient:patients(id, first_name, last_name, phone_number, email),
        service_branch:service_branches(
          id, price, duration_minutes,
          service:services(id, name),
          branch:branches(id, name)
        )
      `,
      )
      .order("preferred_date", { ascending: true })
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) setError(fetchError);
        else setAppointments(data ?? []);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fetchTrigger]);

  return { appointments, loading, error, refetch };
}
