// src/services/admins.js
import { supabase } from "./supabase/supabase";

// Build the Edge Function URL from the Supabase URL
const EDGE_FUNCTION_URL =
  import.meta.env.VITE_SUPABASE_URL.replace(/\/$/, "") +
  "/functions/v1/admin-users";

/**
 * Fetch admins with pagination and search
 */
export async function fetchAdmins({
  page = 1,
  pageSize = 10,
  search = "",
  sortBy = "created_at",
  sortOrder = "desc",
} = {}) {
  let query = supabase.from("admins").select("*", { count: "exact" });

  if (search.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(
      `email.ilike.${term},full_name.ilike.${term},username.ilike.${term}`,
    );
  }

  query = query.order(sortBy, { ascending: sortOrder === "asc" });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}

/**
 * Create a new admin user (including auth) via Supabase Edge Function
 */
export async function createAdminUser(data) {
  const response = await fetch(`${EDGE_FUNCTION_URL}?action=create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Failed to create user.");
  }
  return result.admin;
}

/**
 * Alias for createAdminUser (backward compatibility)
 */
export const createAdmin = createAdminUser;

/**
 * Update admin profile (direct Supabase query – no auth changes)
 */
export async function updateAdmin(id, data) {
  const { data: result, error } = await supabase
    .from("admins")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return result;
}

/**
 * Update user password via Supabase Edge Function
 */
export async function updateAdminPassword(userId, password) {
  const response = await fetch(`${EDGE_FUNCTION_URL}?action=update-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, password }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Failed to update password.");
  }
  return result;
}

/**
 * Delete a single admin (and optionally the auth user – this can be extended)
 */
export async function deleteAdmin(id) {
  const { error } = await supabase.from("admins").delete().eq("id", id);

  if (error) throw error;
}

/**
 * Bulk delete admins
 */
export async function bulkDeleteAdmins(ids) {
  const { error } = await supabase.from("admins").delete().in("id", ids);

  if (error) throw error;
}
