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

    // Build query — filter by branch only when branchId is provided
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
        ),
        appointment_logs(
          id, action, description, performed_by, created_at,
          admin:admins(full_name)
        )
      `,
      )
      .order("preferred_date", { ascending: true });

    // Filter by branch via the service_branches join
    // Supabase supports filtering on related table columns
    if (branchId) {
      query = query.eq("service_branch.branch_id", branchId);
    }

    query.then(({ data, error: fetchError }) => {
      if (cancelled) return;
      if (fetchError) setError(fetchError);
      else setAppointments(data ?? []);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [branchId, fetchTrigger]);

  return { appointments, loading, error, refetch };
}
