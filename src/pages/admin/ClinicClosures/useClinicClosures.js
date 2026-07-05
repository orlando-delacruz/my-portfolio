// src/pages/admin/ClinicClosures/useClinicClosures.js
import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import { fetchClinicClosures } from "../../../services/clinicClosures";

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
  const [totalCount, setTotalCount] = useState(0);

  const refetch = useCallback(() => setRefetchKey((prev) => prev + 1), []);

  useEffect(() => {
    let isMounted = true;

    const loadClosures = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchClinicClosures({
          page,
          pageSize,
          search: filters.search,
          branchId: filters.branch,
          closureType: filters.closureType,
          status: filters.status,
        });

        if (isMounted) {
          const mapped = (result.data || []).map((c) => {
            const start = dayjs(c.start_date);
            const end = dayjs(c.end_date);
            let dateDisplay = start.format("MMMM D, YYYY");
            if (!start.isSame(end, "day")) {
              dateDisplay = `${start.format("MMMM D")} – ${end.format("MMMM D, YYYY")}`;
            }
            let timeRange = "All day";
            if (!c.is_all_day && c.start_time && c.end_time) {
              const st = dayjs(c.start_time, "HH:mm:ss").format("h:mm A");
              const et = dayjs(c.end_time, "HH:mm:ss").format("h:mm A");
              timeRange = `${st} - ${et}`;
            }
            return {
              ...c,
              date: dateDisplay,
              dayOfWeek: start.format("dddd"),
              timeRange,
              closureType: c.closure_type, // ✅ map database field to display field
              status: c.computed_status || "scheduled", // ✅ use computed status
            };
          });

          setClosures(mapped);
          setTotalCount(mapped.length);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load closures");
          setClosures([]);
          setTotalCount(0);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadClosures();

    return () => {
      isMounted = false;
    };
  }, [page, pageSize, filters, refetchKey]);

  return {
    closures,
    loading,
    error,
    pagination: {
      page,
      pageSize,
      total: totalCount,
    },
    filters,
    setFilters,
    setPage,
    setPageSize,
    refetch,
  };
}
