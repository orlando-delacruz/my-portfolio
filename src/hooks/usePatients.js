// src/hooks/usePatients.js
import { useState, useEffect, useCallback, useRef } from "react";
import { fetchPatients } from "../services/patients";

export function usePatients({
  initialPage = 1,
  initialPageSize = 10,
  initialSearch = "",
  initialFilter = "all",
} = {}) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState(initialSearch);
  const [filter, setFilter] = useState(initialFilter);
  const [totalCount, setTotalCount] = useState(0);
  const [refetchKey, setRefetchKey] = useState(0);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      if (!cancelled && isMounted.current) {
        setLoading(true);
        setError(null);
      }
      try {
        const result = await fetchPatients({
          page,
          pageSize,
          search,
          orthodonticFilter: filter,
        });
        if (!cancelled && isMounted.current) {
          setPatients(result.data);
          setTotalCount(result.count);
        }
      } catch (err) {
        console.error("usePatients error:", err);
        if (!cancelled && isMounted.current) {
          setError(err.message || "Failed to load patients");
          setPatients([]);
          setTotalCount(0);
        }
      } finally {
        if (!cancelled && isMounted.current) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [page, pageSize, search, filter, refetchKey]);

  const refetch = useCallback(() => {
    setRefetchKey((prev) => prev + 1);
  }, []);

  return {
    patients,
    loading,
    error,
    page,
    pageSize,
    search,
    filter,
    totalCount,
    setPage,
    setPageSize,
    setSearch,
    setFilter,
    refetch,
  };
}
