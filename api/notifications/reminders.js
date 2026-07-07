// api/notifications/reminders.js
/*global process*/
import { createClient } from '@supabase/supabase-js';
import dayjs from 'dayjs';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const now = dayjs();
    const tomorrow = now.add(1, 'day').startOf('day');
    const tomorrowEnd = tomorrow.endOf('day');

    // Fetch confirmed appointments for tomorrow
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        id,
        preferred_date,
        preferred_time,
        patient:patients(first_name, last_name),
        service_branch:service_branches(branch:branches(name), service:services(name))
      `)
      .eq('approval_status', 'approved')
      .eq('appointment_status', 'scheduled')
      .gte('preferred_date', tomorrow.format('YYYY-MM-DD'))
      .lte('preferred_date', tomorrowEnd.format('YYYY-MM-DD'));

    if (error) throw error;

    // Get all admin IDs
    const { data: admins, error: adminError } = await supabase
      .from('admins')
      .select('id')
      .eq('status', 'active');
    if (adminError) throw adminError;
    const adminIds = admins.map(a => a.id);

    if (adminIds.length === 0) {
      return res.status(200).json({ message: 'No admins found' });
    }

    const notifications = [];

    for (const apt of appointments) {
      const aptDateTime = dayjs(`${apt.preferred_date}T${apt.preferred_time}`);
      const diffHours = aptDateTime.diff(now, 'hour', true);
      const isTomorrow = aptDateTime.isSame(tomorrow, 'day');
      const isWithinHour = diffHours > 0 && diffHours <= 1;

      let type = null;
      let title = '';
      let message = '';

      if (isTomorrow) {
        type = 'UPCOMING_DAY';
        title = 'Appointment Tomorrow';
        message = `${apt.patient.first_name} ${apt.patient.last_name} – ${apt.service_branch?.service?.name || 'Service'}`;
      } else if (isWithinHour) {
        type = 'UPCOMING_HOUR';
        title = 'Appointment in 1 Hour';
        message = `${apt.patient.first_name} ${apt.patient.last_name} – ${apt.service_branch?.service?.name || 'Service'}`;
      } else {
        continue;
      }

      // Check if notification already exists for this appointment and type
      const { data: existing, error: existError } = await supabase
        .from('notifications')
        .select('id')
        .eq('appointment_id', apt.id)
        .eq('type', type)
        .maybeSingle();

      if (existError) {
        console.error('Error checking existing notification:', existError);
        continue;
      }

      if (existing) {
        continue; // skip duplicate
      }

      // Create notification for each admin
      for (const adminId of adminIds) {
        notifications.push({
          admin_id: adminId,
          type,
          title,
          message,
          appointment_id: apt.id,
          metadata: {
            patient_name: `${apt.patient.first_name} ${apt.patient.last_name}`,
            service: apt.service_branch?.service?.name || '',
            branch: apt.service_branch?.branch?.name || '',
            date: apt.preferred_date,
            time: apt.preferred_time,
          },
        });
      }
    }

    if (notifications.length > 0) {
      const { error: insertError } = await supabase
        .from('notifications')
        .insert(notifications);
      if (insertError) throw insertError;
    }

    return res.status(200).json({ created: notifications.length });
  } catch (err) {
    console.error('Reminder generation error:', err);
    return res.status(500).json({ error: err.message });
  }
}