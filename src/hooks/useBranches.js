// src/hooks/useBranches.js
import { useEffect, useState, useRef } from "react";
import { fetchActiveBranches } from "../services/branches";

const MAX_RETRIES = 2;
const RETRY_DELAY = 1500;

export function useBranches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);
  const retryCount = useRef(0);

  useEffect(() => {
    isMounted.current = true;

    const loadBranches = async () => {
      try {
        if (isMounted.current) {
          setLoading(true);
          setError(null);
        }

        console.log("[useBranches] Attempting to load branches...");
        const data = await fetchActiveBranches();

        if (isMounted.current) {
          setBranches(data);
          setLoading(false);
          console.log("[useBranches] Branches loaded successfully:", data);
        }
      } catch (err) {
        console.error("[useBranches] Error:", err);
        if (retryCount.current < MAX_RETRIES) {
          retryCount.current += 1;
          console.log(
            `[useBranches] Retrying (${retryCount.current}/${MAX_RETRIES})...`,
          );
          setTimeout(() => {
            if (isMounted.current) loadBranches();
          }, RETRY_DELAY);
          return;
        }
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

export default useBranches;
