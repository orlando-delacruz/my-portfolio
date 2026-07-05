// api/admin/users.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) throw new Error('Missing VITE_SUPABASE_URL');
if (!serviceRoleKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl, serviceRoleKey);

export default async function handler(req, res) {
  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action } = req.query;

  try {
    // ── CREATE ADMIN (Auth + Profile) ──
    if (action === 'create') {
      const { email, password, full_name, username, phone_number, role, status, avatar_url } = req.body;

      if (!email) return res.status(400).json({ error: 'Email is required.' });
      if (!password) return res.status(400).json({ error: 'Password is required.' });
      if (!full_name) return res.status(400).json({ error: 'Full name is required.' });
      if (!username) return res.status(400).json({ error: 'Username is required.' });
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters.' });
      }

      // ── Check if admin already exists (idempotent) ──
      const { data: existingAdmin, error: checkAdminError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (checkAdminError) {
        console.error('❌ Admin check error:', checkAdminError);
        return res.status(500).json({ error: `Database error: ${checkAdminError.message}` });
      }

      if (existingAdmin) {
        // If admin already exists, return success (idempotent)
        return res.status(200).json({ success: true, admin: existingAdmin });
      }

      // ── Check if auth user already exists (idempotent) ──
      const { data: existingAuthUser, error: authCheckError } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (authCheckError) {
        console.error('❌ Auth check error:', authCheckError);
        return res.status(500).json({ error: `Auth check error: ${authCheckError.message}`);
      }

      let authUserId;
      if (existingAuthUser) {
        authUserId = existingAuthUser.id;
      } else {
        // 1. Create auth user
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name, username },
        });

        if (authError) {
          console.error('❌ Auth error:', authError);
          return res.status(500).json({ error: `Auth error: ${authError.message}`);
        }
        authUserId = authUser.user.id;
      }

      // 2. Insert admin profile
      const { data: admin, error: adminInsertError } = await supabase
        .from('admins')
        .insert({
          auth_user_id: authUserId,
          email,
          full_name,
          username,
          phone_number: phone_number || null,
          role: role || 'staff',
          status: status || 'active',
          avatar_url: avatar_url || null,
        })
        .select()
        .single();

      if (adminInsertError) {
        // Rollback: delete the auth user if we just created it and admin insert fails
        if (!existingAuthUser) {
          await supabase.auth.admin.deleteUser(authUserId);
        }
        console.error('❌ Admin insert error:', adminInsertError);
        return res.status(500).json({ error: `Database error: ${adminInsertError.message}`);
      }

      return res.status(200).json({ success: true, admin });
    }

    // ── UPDATE ADMIN PROFILE ──
    if (action === 'update') {
      const { adminId, email, full_name, username, phone_number, role, status, avatar_url } = req.body;

      if (!adminId) return res.status(400).json({ error: 'Missing adminId' });

      const { data: admin, error: updateError } = await supabase
        .from('admins')
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
        .eq('id', adminId)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Update error:', updateError);
        return res.status(500).json({ error: `Update error: ${updateError.message}`);
      }

      // If email changed and admin has auth_user_id, update auth user email
      if (email && admin.auth_user_id) {
        const { error: authUpdateError } = await supabase.auth.admin.updateUserById(admin.auth_user_id, {
          email,
        });
        if (authUpdateError) {
          console.warn('⚠️ Failed to update auth email:', authUpdateError);
        }
      }

      return res.status(200).json({ success: true, admin });
    }

    // ── DELETE ADMIN ──
    if (action === 'delete') {
      const { adminId, authUserId } = req.body;

      if (!adminId) return res.status(400).json({ error: 'Missing adminId' });

      if (authUserId) {
        const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(authUserId);
        if (deleteAuthError) {
          console.error('❌ Auth deletion error:', deleteAuthError);
        }
      }

      const { error: deleteAdminError } = await supabase
        .from('admins')
        .delete()
        .eq('id', adminId);

      if (deleteAdminError) {
        console.error('❌ Admin deletion error:', deleteAdminError);
        return res.status(500).json({ error: `Delete error: ${deleteAdminError.message}`);
      }

      return res.status(200).json({ success: true });
    }

    // ── UPDATE PASSWORD ──
    if (action === 'update-password') {
      const { userId, password } = req.body;
      if (!userId) return res.status(400).json({ error: 'Missing userId' });
      if (!password || password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters.' });
      }

      const { error } = await supabase.auth.admin.updateUserById(userId, { password });
      if (error) {
        console.error('❌ Password update error:', error);
        return res.status(500).json({ error: `Password update error: ${error.message}`);
      }

      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: `Invalid action: ${action}` });
  } catch (err) {
    console.error('💥 Unhandled error:', err);
    return res.status(500).json({ error: `Internal server error: ${err.message || 'Unknown error'}`);
  }
}