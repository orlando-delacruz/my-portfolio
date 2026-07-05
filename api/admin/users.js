// api/admin/users.js
/*global process*/
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
        branch_id,
        avatar_url,
      } = req.body;

      if (!email) return res.status(400).json({ error: "Email is required." });
      if (!full_name)
        return res.status(400).json({ error: "Full name is required." });
      if (!username)
        return res.status(400).json({ error: "Username is required." });

      // Check if email already exists in admins (including pending)
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

      // Insert admin profile with status 'pending'
      const { data: admin, error: adminError } = await supabase
        .from("admins")
        .insert({
          email,
          full_name,
          username,
          phone_number: phone_number || null,
          role: role || "staff",
          status: "pending",
          branch_id: branch_id || null,
          avatar_url: avatar_url || null,
        })
        .select()
        .single();

      if (adminError) {
        console.error("❌ Admin insert error:", adminError);
        return res
          .status(400)
          .json({ error: `Database error: ${adminError.message}` });
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
        console.error("❌ Auth creation error:", authError);
        return res
          .status(400)
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
          .status(400)
          .json({ error: `Database error: ${updateError.message}` });
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
      const { data: admin, error: adminError } = await supabase
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

      if (adminError) {
        console.error("❌ Update admin error:", adminError);
        return res
          .status(400)
          .json({ error: `Update error: ${adminError.message}` });
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

      // If authUserId exists, delete auth user first
      if (authUserId) {
        const { error: deleteAuthError } =
          await supabase.auth.admin.deleteUser(authUserId);
        if (deleteAuthError) {
          console.error("❌ Auth deletion error:", deleteAuthError);
          // We continue to delete admin anyway (but log the error)
        }
      }

      // Delete admin profile
      const { error: deleteAdminError } = await supabase
        .from("admins")
        .delete()
        .eq("id", adminId);

      if (deleteAdminError) {
        console.error("❌ Admin deletion error:", deleteAdminError);
        return res.status(400).json({
          error: `Failed to delete admin: ${deleteAdminError.message}`,
        });
      }

      return res.status(200).json({ success: true });
    }

    // ── UPDATE PASSWORD ── (for existing active admins)
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
          .status(400)
          .json({ error: `Password update error: ${error.message}` });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: `Invalid action: ${action}` });
  } catch (err) {
    console.error("💥 Unhandled error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}
