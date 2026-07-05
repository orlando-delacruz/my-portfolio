// api/admin/users.js
/*global process*/
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { action } = req.query;

  try {
    // ── CREATE USER ──
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

      if (!email || !password || !full_name || !username) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // 1. Create user in Supabase Auth
      const { data: authUser, error: authError } =
        await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name, username },
        });

      if (authError) {
        console.error("Auth error:", authError);
        return res.status(400).json({ error: authError.message });
      }

      // 2. Add to allowed_emails
      await supabase
        .from("allowed_emails")
        .insert({ email })
        .onConflict("email")
        .ignore();

      // 3. Insert admin profile
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
        // Rollback
        await supabase.auth.admin.deleteUser(authUser.user.id);
        console.error("Admin insert error:", adminError);
        return res.status(400).json({ error: adminError.message });
      }

      return res.status(200).json({ success: true, admin });
    }

    // ── UPDATE PASSWORD ──
    if (action === "update-password") {
      const { userId, password } = req.body;

      if (!userId || !password || password.length < 8) {
        return res
          .status(400)
          .json({ error: "Missing userId or password too short" });
      }

      const { error } = await supabase.auth.admin.updateUserById(userId, {
        password,
      });
      if (error) {
        console.error("Password update error:", error);
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
