// src/hooks/useBranches.js
import { useEffect, useState, useRef } from "react";
import { fetchActiveBranches } from "../services/branches";

export function useBranches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const loadBranches = async () => {
      try {
        if (isMounted.current) {
          setLoading(true);
          setError(null);
        }

        console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
        console.log(
          "Supabase Anon Key:",
          import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 10) + "...",
        );

        const data = await fetchActiveBranches();

        if (isMounted.current) {
          setBranches(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("useBranches error:", err);
        if (isMounted.current) {
          setError(err.message || "Failed to load branches");
          setBranches([]);
          setLoading(false);
        }
      }
    };

    loadBranches();

    return () => {
      isMounted.current = false;
    };
  }, []);

  return { branches, loading, error };
}
