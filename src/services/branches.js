// src/services/branches.js
import { supabase } from "./supabase/supabase";

export async function fetchActiveBranches() {
  // Log environment variables
  console.log(
    "[fetchActiveBranches] Supabase URL:",
    import.meta.env.VITE_SUPABASE_URL,
  );
  console.log(
    "[fetchActiveBranches] Supabase Anon Key exists:",
    !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  );

  // First try using the Supabase client
  try {
    const { data, error } = await supabase
      .from("branches")
      .select("id, name, address, status")
      .eq("status", "active")
      .order("name");

    if (!error) {
      console.log("[fetchActiveBranches] Supabase client success:", data);
      return data || [];
    }
    console.warn("[fetchActiveBranches] Supabase client error:", error);
  } catch (err) {
    console.warn("[fetchActiveBranches] Supabase client exception:", err);
  }

  // Fallback: direct REST call
  console.log("[fetchActiveBranches] Falling back to direct REST fetch...");

  const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/branches?status=eq.active&select=id,name,address,status&order=name`;
  console.log("[fetchActiveBranches] Fetching URL:", url);

  const response = await fetch(url, {
    headers: {
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ""}`,
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
    },
  });

  console.log("[fetchActiveBranches] Response status:", response.status);
  if (!response.ok) {
    const errorText = await response.text();
    console.error("[fetchActiveBranches] Error response:", errorText);
    throw new Error(
      `Failed to fetch branches: ${response.status} ${response.statusText} – ${errorText}`,
    );
  }
  const data = await response.json();
  console.log("[fetchActiveBranches] Direct fetch success:", data);
  return data;
}