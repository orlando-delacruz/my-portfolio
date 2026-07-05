// api/admin/users.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) throw new Error("Missing VITE_SUPABASE_URL");
if (!serviceRoleKey)
  throw new Error(
    "Missing SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_SERVICE_ROLE_KEY",
  );

const supabase = createClient(supabaseUrl, serviceRoleKey);

export default async function handler(req, res) {
  // Only POST allowed
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
      const { data: existingAdmin } = await supabase
        .from("admins")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existingAdmin) {
        return res
          .status(409)
          .json({ error: "An administrator with this email already exists." });
      }

      // Insert pending admin profile
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
        console.error("❌ Update error:", updateError);
        return res
          .status(500)
          .json({ error: `Update error: ${updateError.message}` });
      }

      // If email changed and admin has auth_user_id, update auth user email
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

    // ── UPDATE PASSWORD ── (optional, for active admins)
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
