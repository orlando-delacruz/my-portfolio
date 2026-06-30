// src/services/branches.js
import { supabase } from "./supabase/supabase";

export async function fetchActiveBranches() {
  const { data, error } = await supabase
    .from("branches")
    .select("id, name, status")
    .eq("status", "active")
    .order("name");

  if (error) throw error;
  return data;
}
