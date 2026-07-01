// src/hooks/useDashboardData.js
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { getDashboardData } from "../services/dashboard";

/**
 * Custom hook for fetching dashboard data with loading/error states
 * Automatically refetches when auth user changes
 */
export function useDashboardData(branchId = null) {
  const profile = useAuthStore((s) => s.profile);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchDashboard() {
      if (!profile?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await getDashboardData(profile.id, branchId);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        if (!cancelled) {
          setError(err.message || "Failed to load dashboard data");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchDashboard();

    return () => {
      cancelled = true;
    };
  }, [profile?.id, branchId, refetchTrigger]);

  return { data, loading, error, refetch };
}
