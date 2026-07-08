// src/services/admins.js
import { supabase } from "./supabase/supabase";

async function callAdminAPI(action, body) {
  const res = await fetch(`/api/admin/users?action=${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  // Log for debugging
  console.log(`📡 API response status: ${res.status} for action ${action}`);

  // Get the response text first
  const text = await res.text();
  console.log(`📡 Response body:`, text);

  // Try to parse JSON
  let result;
  try {
    result = JSON.parse(text);
  } catch (parseError) {
    const error = new Error(
      `Unexpected response from API: ${text || "empty response"}`,
    );
    error.cause = parseError;
    throw error;
  }

  if (!res.ok) {
    // Use the `error` field from our API, fallback to `message` or generic
    const errorMsg = result?.error || result?.message || "API request failed";
    const error = new Error(errorMsg);
    // Attach the result as cause if available
    if (result) error.cause = result;
    throw error;
  }

  return result;
}

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

export async function createAdmin(data) {
  const result = await callAdminAPI("create", data);
  return result.admin;
}

export async function updateAdmin(adminId, data) {
  const result = await callAdminAPI("update", { adminId, ...data });
  return result.admin;
}

export async function deleteAdmin(adminId, authUserId) {
  const result = await callAdminAPI("delete", { adminId, authUserId });
  return result;
}

export async function updateAdminPassword(userId, password) {
  if (!userId)
    throw new Error("Missing auth_user_id – admin not linked to auth user.");
  const result = await callAdminAPI("update-password", { userId, password });
  return result;
}

export async function bulkDeleteAdmins(ids) {
  const { data: admins, error } = await supabase
    .from("admins")
    .select("id, auth_user_id")
    .in("id", ids);

  if (error) throw error;

  for (const admin of admins) {
    await deleteAdmin(admin.id, admin.auth_user_id);
  }
}
