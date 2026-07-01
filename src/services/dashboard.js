// src/services/dashboard.js
import { supabase } from "./supabase/supabase";

/**
 * Fetch all dashboard data in a single API call
 * @param {string} adminId - Current admin user ID (optional)
 * @param {string} branchId - Filter by branch (optional)
 * @returns {Promise<Object>} Dashboard data
 */
export async function getDashboardData(adminId = null, branchId = null) {
  const { data, error } = await supabase.rpc("get_dashboard_all_data", {
    p_admin_id: adminId,
    p_branch_id: branchId || null,
  });

  if (error) throw error;
  return data;
}

/**
 * Fetch only dashboard statistics
 */
export async function getDashboardStats(adminId = null) {
  const { data, error } = await supabase.rpc("get_dashboard_stats", {
    p_admin_id: adminId,
  });

  if (error) throw error;
  return data;
}

/**
 * Fetch today's schedule
 */
export async function getTodaySchedule(adminId = null, branchId = null) {
  const { data, error } = await supabase.rpc("get_today_schedule", {
    p_admin_id: adminId,
    p_branch_id: branchId || null,
  });

  if (error) throw error;
  return data || [];
}

/**
 * Fetch upcoming appointments
 */
export async function getUpcomingAppointments(
  adminId = null,
  limit = 5,
  branchId = null,
) {
  const { data, error } = await supabase.rpc("get_upcoming_appointments", {
    p_admin_id: adminId,
    p_limit: limit,
    p_branch_id: branchId || null,
  });

  if (error) throw error;
  return data || [];
}

/**
 * Fetch recent activity
 */
export async function getRecentActivity(adminId = null, limit = 6) {
  const { data, error } = await supabase.rpc("get_recent_activity", {
    p_admin_id: adminId,
    p_limit: limit,
  });

  if (error) throw error;
  return data || [];
}

/**
 * Fetch next appointment
 */
export async function getNextAppointment(adminId = null, branchId = null) {
  const { data, error } = await supabase.rpc("get_next_appointment", {
    p_admin_id: adminId,
    p_branch_id: branchId || null,
  });

  if (error) throw error;
  return data;
}
