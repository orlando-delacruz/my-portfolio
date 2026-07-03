// src/pages/admin/ClinicClosures/useClinicClosures.js
import { useState, useEffect, useMemo, useCallback } from "react";
import { mockClosures } from "../../../data/admin/clinicClosures";

export function useClinicClosures() {
  const [closures, setClosures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    search: "",
    branch: "all",
    closureType: "all",
    status: "all",
  });
  const [refetchKey, setRefetchKey] = useState(0);

  const refetch = useCallback(() => setRefetchKey((prev) => prev + 1), []);

  // Simulate data fetching
  useEffect(() => {
    let isMounted = true;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(null);

    const timer = setTimeout(() => {
      try {
        // Filter mock data
        let filtered = [...mockClosures];

        // Search
        if (filters.search.trim()) {
          const searchLower = filters.search.toLowerCase().trim();
          filtered = filtered.filter(
            (c) =>
              c.reason.toLowerCase().includes(searchLower) ||
              c.closureType.toLowerCase().includes(searchLower),
          );
        }

        // Branch filter (mock - all closures have branchId)
        if (filters.branch !== "all") {
          filtered = filtered.filter((c) => c.branchId === filters.branch);
        }

        // Closure type
        if (filters.closureType !== "all") {
          filtered = filtered.filter(
            (c) => c.closureType === filters.closureType,
          );
        }

        // Status
        if (filters.status !== "all") {
          filtered = filtered.filter((c) => c.status === filters.status);
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (isMounted) {
          setClosures(filtered);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load closures");
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [filters, refetchKey]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return closures.slice(start, start + pageSize);
  }, [closures, page, pageSize]);

  return {
    closures: paginatedData,
    loading,
    error,
    pagination: {
      page,
      pageSize,
      total: closures.length,
    },
    filters,
    setFilters,
    setPage,
    setPageSize,
    refetch,
  };
}
