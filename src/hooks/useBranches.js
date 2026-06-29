import { useEffect, useState } from "react";
import { supabase } from "../services/supabase/supabase";

export function useBranches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("branches")
      .select("*")
      .eq("status", "active") // is_active (bool) → status = 'active' (text)
      .then(({ data }) => {
        setBranches(data ?? []);
        setLoading(false);
      });
  }, []);

  return { branches, loading };
}
