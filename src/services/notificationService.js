// src/services/notificationService.js
import { supabase } from './supabase/supabase';

/**
 * Fetch all notifications for the current admin.
 */
export async function fetchNotifications(adminId) {
  if (!adminId) throw new Error('Admin ID is required');
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('admin_id', adminId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

/**
 * Create a new notification for a specific admin.
 */
export async function createNotification({ adminId, type, title, message, appointmentId = null, metadata = {} }) {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      admin_id: adminId,
      type,
      title,
      message,
      appointment_id: appointmentId,
      metadata,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Create notifications for multiple admins (e.g., for a new booking).
 */
export async function createNotificationsForAdmins(adminIds, notificationData) {
  const records = adminIds.map(adminId => ({
    admin_id: adminId,
    ...notificationData,
  }));
  const { data, error } = await supabase
    .from('notifications')
    .insert(records)
    .select();
  if (error) throw error;
  return data;
}

/**
 * Mark a single notification as read.
 */
export async function markNotificationAsRead(notificationId) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Mark all notifications as read for the current admin.
 */
export async function markAllNotificationsAsRead(adminId) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('admin_id', adminId)
    .eq('is_read', false)
    .select();
  if (error) throw error;
  return data;
}

/**
 * Delete a single notification.
 */
export async function deleteNotification(notificationId) {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);
  if (error) throw error;
}

/**
 * Get unread count for the admin.
 */
export async function getUnreadCount(adminId) {
  if (!adminId) return 0;
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('admin_id', adminId)
    .eq('is_read', false);
  if (error) throw error;
  return count || 0;
}