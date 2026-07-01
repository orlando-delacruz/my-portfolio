// src/hooks/useServiceBranches.js
import { useEffect, useState, useRef } from "react";
import { fetchServicesForBranch } from "../services/serviceBranches";

export function useServiceBranches(branchId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    async function loadServices() {
      if (!branchId) {
        if (isMounted.current) {
          setData([]);
          setLoading(false);
        }
        return;
      }

      if (isMounted.current) {
        setLoading(true);
      }

      try {
        const result = await fetchServicesForBranch(branchId);
        if (isMounted.current) {
          setData(result);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        if (isMounted.current) {
          setData([]);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    }

    loadServices();
  }, [branchId]);

  return { serviceBranches: data, loading };
}
