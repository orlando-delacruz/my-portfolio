// api/admin/users.js
import { createClient } from "@supabase/supabase-js";

// ── Environment variables ──
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing VITE_SUPABASE_URL environment variable.");
}
if (!serviceRoleKey) {
  throw new Error(
    "Missing SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_SERVICE_ROLE_KEY environment variable.",
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// ── CORS headers (optional, but good for preflight) ──
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeaders(corsHeaders);
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { action } = req.query;

  try {
    // ── CREATE ADMIN PROFILE (pending) ──
    if (action === "create") {
      const {
        email,
        full_name,
        username,
        phone_number,
        role,
        status,
        avatar_url,
      } = req.body;

      if (!email) return res.status(400).json({ error: "Email is required." });
      if (!full_name)
        return res.status(400).json({ error: "Full name is required." });
      if (!username)
        return res.status(400).json({ error: "Username is required." });

      // Check if email already exists in admins
      const { data: existingAdmin, error: checkError } = await supabase
        .from("admins")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (checkError) {
        console.error("❌ Check error:", checkError);
        return res
          .status(500)
          .json({ error: `Database check error: ${checkError.message}` });
      }

      if (existingAdmin) {
        return res
          .status(409)
          .json({ error: "An administrator with this email already exists." });
      }

      // Insert admin profile with status 'pending'
      const { data: admin, error: insertError } = await supabase
        .from("admins")
        .insert({
          email,
          full_name,
          username,
          phone_number: phone_number || null,
          role: role || "staff",
          status: status || "pending",
          avatar_url: avatar_url || null,
        })
        .select()
        .single();

      if (insertError) {
        console.error("❌ Insert error:", insertError);
        return res
          .status(500)
          .json({ error: `Database insert error: ${insertError.message}` });
      }

      return res.status(200).json({ success: true, admin });
    }

    // ── ACTIVATE ADMIN (create auth user) ──
    if (action === "activate") {
      const { adminId, password } = req.body;

      if (!adminId) return res.status(400).json({ error: "Missing adminId" });
      if (!password || password.length < 8) {
        return res
          .status(400)
          .json({ error: "Password must be at least 8 characters." });
      }

      // Fetch the pending admin
      const { data: admin, error: fetchError } = await supabase
        .from("admins")
        .select("*")
        .eq("id", adminId)
        .single();

      if (fetchError || !admin) {
        console.error("❌ Admin not found:", fetchError);
        return res.status(404).json({ error: "Admin not found" });
      }

      if (admin.status !== "pending") {
        return res
          .status(400)
          .json({ error: "This admin account is already active or inactive." });
      }

      // Check if email already exists in auth.users
      const { data: existingAuthUser } = await supabase
        .from("auth.users")
        .select("id")
        .eq("email", admin.email)
        .maybeSingle();

      if (existingAuthUser) {
        return res.status(409).json({
          error:
            "This email is already registered in the authentication system.",
        });
      }

      // 1. Create auth user
      const { data: authUser, error: authError } =
        await supabase.auth.admin.createUser({
          email: admin.email,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: admin.full_name,
            username: admin.username,
          },
        });

      if (authError) {
        console.error("❌ Auth error:", authError);
        return res
          .status(500)
          .json({ error: `Auth error: ${authError.message}` });
      }

      // 2. Update admin profile (set auth_user_id and status to active)
      const { data: updatedAdmin, error: updateError } = await supabase
        .from("admins")
        .update({
          auth_user_id: authUser.user.id,
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", adminId)
        .select()
        .single();

      if (updateError) {
        // Rollback: delete the auth user
        await supabase.auth.admin.deleteUser(authUser.user.id);
        console.error("❌ Update error:", updateError);
        return res
          .status(500)
          .json({ error: `Update error: ${updateError.message}` });
      }

      return res.status(200).json({ success: true, admin: updatedAdmin });
    }

    // ── UPDATE ADMIN PROFILE ──
    if (action === "update") {
      const {
        adminId,
        email,
        full_name,
        username,
        phone_number,
        role,
        status,
        avatar_url,
      } = req.body;

      if (!adminId) return res.status(400).json({ error: "Missing adminId" });

      // Update admin profile
      const { data: admin, error: updateError } = await supabase
        .from("admins")
        .update({
          email,
          full_name,
          username,
          phone_number,
          role,
          status,
          avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", adminId)
        .select()
        .single();

      if (updateError) {
        console.error("❌ Update admin error:", updateError);
        return res
          .status(500)
          .json({ error: `Update error: ${updateError.message}` });
      }

      // If email changed and admin is active, update auth user email
      if (email && admin.auth_user_id) {
        const { error: authUpdateError } =
          await supabase.auth.admin.updateUserById(admin.auth_user_id, {
            email,
          });
        if (authUpdateError) {
          console.warn("⚠️ Failed to update auth email:", authUpdateError);
        }
      }

      return res.status(200).json({ success: true, admin });
    }

    // ── DELETE ADMIN ──
    if (action === "delete") {
      const { adminId, authUserId } = req.body;

      if (!adminId) return res.status(400).json({ error: "Missing adminId" });

      if (authUserId) {
        const { error: deleteAuthError } =
          await supabase.auth.admin.deleteUser(authUserId);
        if (deleteAuthError) {
          console.error("❌ Auth deletion error:", deleteAuthError);
        }
      }

      const { error: deleteAdminError } = await supabase
        .from("admins")
        .delete()
        .eq("id", adminId);

      if (deleteAdminError) {
        console.error("❌ Admin deletion error:", deleteAdminError);
        return res
          .status(500)
          .json({ error: `Delete error: ${deleteAdminError.message}` });
      }

      return res.status(200).json({ success: true });
    }

    // ── UPDATE PASSWORD ──
    if (action === "update-password") {
      const { userId, password } = req.body;
      if (!userId) return res.status(400).json({ error: "Missing userId" });
      if (!password || password.length < 8) {
        return res
          .status(400)
          .json({ error: "Password must be at least 8 characters." });
      }

      const { error } = await supabase.auth.admin.updateUserById(userId, {
        password,
      });
      if (error) {
        console.error("❌ Password update error:", error);
        return res
          .status(500)
          .json({ error: `Password update error: ${error.message}` });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: `Invalid action: ${action}` });
  } catch (err) {
    console.error("💥 Unhandled error:", err);
    return res.status(500).json({
      error: `Internal server error: ${err.message || "Unknown error"}`,
    });
  }
}
