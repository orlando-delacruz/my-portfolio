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

// ── Helper: log and return JSON error ──
function errorResponse(res, step, message, status = 500, details = null) {
  console.error(`❌ ${step}:`, message, details || "");
  return res.status(status).json({
    success: false,
    step,
    error: message,
    details: details || undefined,
  });
}

export default async function handler(req, res) {
  // Only POST allowed
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { action } = req.query;
  console.log(`📥 Incoming request: action=${action}, body:`, req.body);

  try {
    // ── CREATE ──
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
      } = req.body;

      if (!email)
        return errorResponse(res, "create_validate", "Email is required.", 400);
      if (!password)
        return errorResponse(
          res,
          "create_validate",
          "Password is required.",
          400,
        );
      if (!full_name)
        return errorResponse(
          res,
          "create_validate",
          "Full name is required.",
          400,
        );
      if (!username)
        return errorResponse(
          res,
          "create_validate",
          "Username is required.",
          400,
        );
      if (password.length < 8) {
        return errorResponse(
          res,
          "create_validate",
          "Password must be at least 8 characters.",
          400,
        );
      }

      // ── Check if admin already exists (idempotent) ──
      const { data: existingAdmin, error: checkAdminError } = await supabase
        .from("admins")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (checkAdminError) {
        return errorResponse(
          res,
          "create_check_admin",
          checkAdminError.message,
          500,
          checkAdminError,
        );
      }

      if (existingAdmin) {
        console.log(
          `ℹ️ Admin already exists for email ${email}, returning existing.`,
        );
        return res.status(200).json({ success: true, admin: existingAdmin });
      }

      let authUserId;

      // ── Try to create auth user ──
      const { data: authUser, error: authError } =
        await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name, username },
        });

      if (authError) {
        // If the email is already registered, find the existing user via listUsers
        if (
          authError.message &&
          authError.message.toLowerCase().includes("already been registered")
        ) {
          console.log(
            `ℹ️ Email ${email} already exists in auth. Fetching existing user...`,
          );
          const { data: users, error: listError } =
            await supabase.auth.admin.listUsers();
          if (listError) {
            return errorResponse(
              res,
              "create_list_users",
              listError.message,
              500,
              listError,
            );
          }
          const existing = users.users.find((u) => u.email === email);
          if (existing) {
            authUserId = existing.id;
            console.log(`✅ Found existing auth user: ${authUserId}`);
          } else {
            return errorResponse(
              res,
              "create_existing_user_not_found",
              "Email exists but user not found in list.",
              500,
            );
          }
        } else {
          return errorResponse(
            res,
            "create_auth_user",
            authError.message,
            500,
            authError,
          );
        }
      } else {
        authUserId = authUser.user.id;
        console.log(`✅ Auth user created: ${authUserId}`);
      }

      // ── Insert admin profile ──
      const { data: admin, error: adminInsertError } = await supabase
        .from("admins")
        .insert({
          auth_user_id: authUserId,
          email,
          full_name,
          username,
          phone_number: phone_number || null,
          role: role || "staff",
          status: status || "active",
          avatar_url: avatar_url || null,
        })
        .select()
        .single();

      if (adminInsertError) {
        // Rollback: delete the auth user if we created it and admin insert fails
        if (
          !authError ||
          !authError.message.includes("already been registered")
        ) {
          // We created it, so delete it
          await supabase.auth.admin.deleteUser(authUserId);
        }
        return errorResponse(
          res,
          "create_admin_profile",
          adminInsertError.message,
          500,
          adminInsertError,
        );
      }

      console.log(`✅ Admin created: ${admin.id}`);
      return res.status(200).json({ success: true, admin });
    }

    // ── UPDATE ──
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

      if (!adminId) {
        return errorResponse(res, "update_validate", "Missing adminId", 400);
      }

      console.log(`📝 Updating admin ${adminId}:`, {
        email,
        full_name,
        username,
        role,
        status,
      });

      // 1. Update admin profile
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
        return errorResponse(
          res,
          "update_admin_profile",
          updateError.message,
          500,
          updateError,
        );
      }

      console.log(`✅ Admin profile updated:`, admin);

      // 2. If email changed and admin has auth_user_id, update auth user email
      if (email && admin.auth_user_id) {
        console.log(
          `📧 Updating auth email for user ${admin.auth_user_id} to ${email}`,
        );
        const { error: authUpdateError } =
          await supabase.auth.admin.updateUserById(admin.auth_user_id, {
            email,
          });
        if (authUpdateError) {
          console.warn("⚠️ Failed to update auth email:", authUpdateError);
          return res.status(200).json({
            success: true,
            admin,
            warning: `Auth email update failed: ${authUpdateError.message}`,
          });
        }
        console.log(`✅ Auth email updated successfully`);
      }

      return res.status(200).json({ success: true, admin });
    }

    // ── DELETE ──
    if (action === "delete") {
      const { adminId, authUserId } = req.body;

      if (!adminId) {
        return errorResponse(res, "delete_validate", "Missing adminId", 400);
      }

      console.log(
        `🗑️ Deleting admin ${adminId}, authUserId: ${authUserId || "none"}`,
      );

      // 1. Delete auth user if present
      if (authUserId) {
        console.log(`🗑️ Deleting auth user ${authUserId}`);
        const { error: deleteAuthError } =
          await supabase.auth.admin.deleteUser(authUserId);
        if (deleteAuthError) {
          console.error("⚠️ Auth deletion failed:", deleteAuthError);
          // Continue to delete admin, but return a warning
          const { error: deleteAdminError } = await supabase
            .from("admins")
            .delete()
            .eq("id", adminId);

          if (deleteAdminError) {
            return errorResponse(
              res,
              "delete_admin_after_auth_fail",
              deleteAdminError.message,
              500,
              deleteAdminError,
            );
          }

          return res.status(200).json({
            success: true,
            warning: `Admin deleted, but auth user could not be removed: ${deleteAuthError.message}`,
          });
        }
        console.log(`✅ Auth user deleted`);
      }

      // 2. Delete admin profile
      const { error: deleteAdminError } = await supabase
        .from("admins")
        .delete()
        .eq("id", adminId);

      if (deleteAdminError) {
        return errorResponse(
          res,
          "delete_admin_profile",
          deleteAdminError.message,
          500,
          deleteAdminError,
        );
      }

      console.log(`✅ Admin profile deleted`);
      return res.status(200).json({ success: true });
    }

    // ── UPDATE PASSWORD ──
    if (action === "update-password") {
      const { userId, password } = req.body;
      if (!userId)
        return errorResponse(res, "password_validate", "Missing userId", 400);
      if (!password || password.length < 8) {
        return errorResponse(
          res,
          "password_validate",
          "Password must be at least 8 characters.",
          400,
        );
      }

      const { error } = await supabase.auth.admin.updateUserById(userId, {
        password,
      });
      if (error) {
        return errorResponse(res, "password_update", error.message, 500, error);
      }

      return res.status(200).json({ success: true });
    }

    return errorResponse(
      res,
      "unknown_action",
      `Invalid action: ${action}`,
      400,
    );
  } catch (err) {
    console.error("💥 Unhandled exception:", err);
    return res.status(500).json({
      success: false,
      step: "unhandled",
      error: err.message || "Unknown error",
      stack: err.stack,
    });
  }
}
