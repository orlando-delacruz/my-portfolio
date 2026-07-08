// src/hooks/useAppointments.js
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../services/supabase/supabase";

export function useAppointments(source = null) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const refetch = useCallback(() => setFetchTrigger((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        let query = supabase
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
          `
          )
          .order("preferred_date", { ascending: true });

        if (source && source !== 'all') {
          if (source === 'online') {
            query = query.eq('is_walk_in', false);
          } else if (source === 'walk-in') {
            query = query.eq('is_walk_in', true);
          }
        }

        const { data, error: fetchError } = await query;
        if (cancelled) return;
        if (fetchError) setError(fetchError);
        else setAppointments(data ?? []);
      } catch (err) {
        if (cancelled) return;
        setError(err.message || 'Failed to fetch appointments');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [fetchTrigger, source]);

  return { appointments, loading, error, refetch };
}