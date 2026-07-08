// src/services/dashboard.js
import { supabase } from "./supabase/supabase";
import dayjs from "dayjs";

/**
 * Fetch all dashboard data in a single API call
 * @param {string} adminId - Current admin user ID (optional)
 * @param {string} branchId - Filter by branch (optional)
 * @returns {Promise<Object>} Dashboard data
 */
export async function getDashboardData(adminId = null, branchId = null) {
  const today = dayjs().format("YYYY-MM-DD");
  const now = dayjs().toISOString();

  const { data, error } = await supabase.rpc("get_dashboard_all_data", {
    p_admin_id: adminId,
    p_branch_id: branchId || null,
    p_today_date: today,
    p_now: now,
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

// ── Walk-in specific functions ──

/**
 * Get today's walk-in count.
 */
export async function getWalkInCount() {
  const today = dayjs().format("YYYY-MM-DD");

  let query = supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("is_walk_in", true)
    .eq("preferred_date", today)
    .in("appointment_status", ["scheduled", "confirmed"]);

  const { count, error } = await query;
  if (error) throw error;
  return count || 0;
}

/**
 * Get today's walk-in appointments with patient details.
 */
export async function getTodayWalkIns(limit = 5) {
  const today = dayjs().format("YYYY-MM-DD");

  let query = supabase
    .from("appointments")
    .select(`
      id,
      preferred_time,
      service_branch:service_branches(
        branch:branches(name),
        service:services(name)
      ),
      patient:patients(first_name, last_name, phone_number),
      approval_status,
      appointment_status
    `)
    .eq("is_walk_in", true)
    .eq("preferred_date", today)
    .in("appointment_status", ["scheduled", "confirmed"])
    .order("preferred_time", { ascending: true })
    .limit(limit);

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map((apt) => ({
    id: apt.id,
    patient_name: `${apt.patient.first_name} ${apt.patient.last_name}`.trim(),
    time: dayjs(apt.preferred_time, "HH:mm:ss").format("h:mm A"),
    branch: apt.service_branch?.branch?.name || "—",
    service: apt.service_branch?.service?.name || "—",
    status: apt.approval_status === "approved" ? "confirmed" : "pending",
  }));
}