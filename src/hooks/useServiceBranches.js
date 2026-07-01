// src/hooks/useServiceBranches.js
import { useEffect, useState } from "react";
import { fetchServicesForBranch } from "../services/serviceBranches";

export function useServiceBranches(branchId) {
  const [serviceBranches, setServiceBranches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!branchId) {
      setServiceBranches([]);
      return;
    }
    let mounted = true;
    setLoading(true);
    fetchServicesForBranch(branchId)
      .then((data) => mounted && setServiceBranches(data))
      .catch(() => mounted && setServiceBranches([]))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [branchId]);

  return { serviceBranches, loading };
}
