// src/hooks/useBranches.js
import { useEffect, useState } from "react";
import { fetchActiveBranches } from "../services/branches";

export function useBranches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchActiveBranches()
      .then((data) => mounted && setBranches(data))
      .catch(() => mounted && setBranches([]))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return { branches, loading };
}
