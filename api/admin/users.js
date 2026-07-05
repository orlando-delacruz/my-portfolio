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
    // ── CREATE ADMIN USER ──
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

      // Validate required fields
      if (!email) return res.status(400).json({ error: "Email is required." });
      if (!password)
        return res.status(400).json({ error: "Password is required." });
      if (!full_name)
        return res.status(400).json({ error: "Full name is required." });
      if (!username)
        return res.status(400).json({ error: "Username is required." });
      if (password.length < 8) {
        return res
          .status(400)
          .json({ error: "Password must be at least 8 characters." });
      }

      // ── Duplicate check: admins table ──
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

      // ── Duplicate check: auth.users (to avoid 422) ──
      const { data: existingAuthUser } = await supabase
        .from("auth.users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existingAuthUser) {
        return res.status(409).json({
          error:
            "This email is already registered in the authentication system. Please use a different email or contact support to recover the account.",
        });
      }

      // 1. Create auth user
      const { data: authUser, error: authError } =
        await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name, username },
        });

      if (authError) {
        console.error("❌ Auth error:", authError);
        return res
          .status(400)
          .json({ error: `Auth error: ${authError.message}` });
      }

      // 2. Insert admin profile
      const { data: admin, error: adminError } = await supabase
        .from("admins")
        .insert({
          auth_user_id: authUser.user.id,
          email,
          full_name,
          username,
          phone_number: phone_number || null,
          role: role || "staff",
          status: status || "active",
          login_method: "password",
          avatar_url: avatar_url || null,
        })
        .select()
        .single();

      if (adminError) {
        // Rollback: delete the auth user
        await supabase.auth.admin.deleteUser(authUser.user.id);
        console.error("❌ Admin insert error:", adminError);
        return res
          .status(400)
          .json({ error: `Database error: ${adminError.message}` });
      }

      return res.status(200).json({ success: true, admin });
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
