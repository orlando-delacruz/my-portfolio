// api/notifications/create.js
/*global process*/
import { createClient } from '@supabase/supabase-js';

// Use service role key to bypass RLS
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, title, message, appointment_id, metadata } = req.body;

    // Validate required fields
    if (!type || !title || !message || !appointment_id) {
      return res.status(400).json({
        error: 'Missing required fields: type, title, message, appointment_id',
      });
    }

    // Fetch all active admin IDs
    const { data: admins, error: adminError } = await supabase
      .from('admins')
      .select('id')
      .eq('status', 'active');

    if (adminError) {
      console.error('[Notification Create] Error fetching admins:', adminError);
      return res.status(500).json({ error: 'Failed to fetch admins' });
    }

    if (!admins || admins.length === 0) {
      console.warn('[Notification Create] No active admins found');
      return res.status(200).json({ message: 'No admins to notify' });
    }

    // Build notification records
    const records = admins.map((admin) => ({
      admin_id: admin.id,
      type,
      title,
      message,
      appointment_id,
      metadata: metadata || {},
    }));

    // Insert notifications
    const { data, error: insertError } = await supabase
      .from('notifications')
      .insert(records)
      .select();

    if (insertError) {
      console.error('[Notification Create] Insert error:', insertError);
      return res.status(500).json({ error: 'Failed to create notifications' });
    }

    console.log(`[Notification Create] Created ${data.length} notifications`);
    return res.status(200).json({ success: true, count: data.length });
  } catch (err) {
    console.error('[Notification Create] Unexpected error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}