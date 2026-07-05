// api/create-admin-user.js
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

  const { email, password, full_name, username, role, avatar_url } = req.body;

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

  try {
    const { data: authUser, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name,
          username,
          role: role || "staff",
          is_admin: true,
          avatar_url: avatar_url || null,
        },
      });

    if (authError) {
      console.error("❌ Auth error:", authError);
      return res
        .status(400)
        .json({ error: `Auth error: ${authError.message}` });
    }

    console.log("✅ Admin user created:", authUser.user.id);
    return res.status(200).json({
      success: true,
      user: authUser.user,
    });
  } catch (err) {
    console.error("💥 Error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}
