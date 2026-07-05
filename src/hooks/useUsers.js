// src/hooks/useUsers.js
import { useState, useEffect, useCallback, useRef } from "react";
import { fetchAdmins } from "../services/admins";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [refetchKey, setRefetchKey] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const isMounted = useRef(true);

  const refetch = useCallback(() => setRefetchKey((prev) => prev + 1), []);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchAdmins({ page, pageSize, search });
        if (isMounted.current) {
          setUsers(result.data);
          setTotalCount(result.count);
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err.message || "Failed to load users");
          setUsers([]);
          setTotalCount(0);
        }
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    loadUsers();
  }, [page, pageSize, search, refetchKey]);

  return {
    users,
    loading,
    error,
    pagination: { page, pageSize, total: totalCount },
    search,
    setSearch,
    setPage,
    setPageSize,
    refetch,
  };
}
