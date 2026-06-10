// src/hooks/useBranches.js
import { useEffect, useState } from "react";
import { supabase } from "..//services/supabase/supabase";

export function useBranches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("branches")
      .select("*")
      .eq("is_active", true)
      .then(({ data }) => {
        setBranches(data ?? []);
        setLoading(false);
      });
  }, []);

  return { branches, loading };
}
