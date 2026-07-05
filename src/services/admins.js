// src/services/admins.js
import { supabase } from "./supabase/supabase";

// ── Helper to call admin operations using the service role key ──
async function callAdminAPI(action, body) {
  // For local development, we can use the service role key directly with supabase client.
  // We'll temporarily set the auth header to use the service role key for this request.
  const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

  if (import.meta.env.DEV && serviceRoleKey) {
    // Clone the supabase client with a new auth header for this request.
    // We'll use fetch directly to avoid creating a new client.
    const url = `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/admin/users`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
    };

    if (action === "create") {
      const {
        email,
        password,
        full_name,
        username,
        phone_number,
        role,
        status,
        avatar_url,
      } = body;

      // 1. Create auth user via direct API call
      const createRes = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name, username },
        }),
      });
      if (!createRes.ok) {
        const errorData = await createRes.json();
        throw new Error(errorData.message || "Auth creation failed");
      }
      const authUser = await createRes.json();

      // 2. Insert admin profile via supabase client (with service role key)
      // Since we're using the regular supabase client, we need to set the auth header for this request.
      // We'll use the supabase client's `auth.setSession` to set a temporary session? No.

      // Simpler: use fetch directly for the admin profile insert as well.
      const insertRes = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/admins`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${serviceRoleKey}`,
            apikey: serviceRoleKey,
            Prefer: "return=representation",
          },
          body: JSON.stringify({
            auth_user_id: authUser.id,
            email,
            full_name,
            username,
            phone_number: phone_number || null,
            role: role || "staff",
            status: status || "active",
            login_method: "password",
            avatar_url: avatar_url || null,
          }),
        },
      );
      if (!insertRes.ok) {
        // Rollback: delete the auth user
        await fetch(`${url}/${authUser.id}`, {
          method: "DELETE",
          headers,
        });
        const errorData = await insertRes.json();
        throw new Error(errorData.message || "Admin insert failed");
      }
      const admin = await insertRes.json();
      return { admin: admin[0] };
    }

    if (action === "update-password") {
      const { userId, password } = body;
      const updateRes = await fetch(`${url}/${userId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ password }),
      });
      if (!updateRes.ok) {
        const errorData = await updateRes.json();
        throw new Error(errorData.message || "Password update failed");
      }
      return { success: true };
    }
  }

  // Production: use Vercel API route
  const res = await fetch(`/api/admin/users?action=${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "API call failed");
  return result;
}

// ── Public functions ──
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

export async function createAdminUser(data) {
  const result = await callAdminAPI("create", data);
  return result.admin;
}

export const createAdmin = createAdminUser;

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

export async function updateAdminPassword(userId, password) {
  if (!userId)
    throw new Error("Missing auth_user_id – admin not linked to auth user.");
  const result = await callAdminAPI("update-password", { userId, password });
  return result;
}

export async function deleteAdmin(id) {
  const { error } = await supabase.from("admins").delete().eq("id", id);
  if (error) throw error;
}

export async function bulkDeleteAdmins(ids) {
  const { error } = await supabase.from("admins").delete().in("id", ids);
  if (error) throw error;
}
