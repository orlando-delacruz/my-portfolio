// src/hooks/useDashboardData.js
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { getDashboardData, getWalkInCount, getTodayWalkIns } from "../services/dashboard";

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
        const [mainData, walkInCount, walkIns] = await Promise.all([
          getDashboardData(profile.id, branchId),
          getWalkInCount(), // ✅ removed adminId
          getTodayWalkIns(), // ✅ removed adminId
        ]);

        if (!cancelled) {
          setData({
            ...mainData,
            walkInCount,
            walkIns,
          });
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