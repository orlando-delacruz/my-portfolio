// src/services/branches.js
import { supabase } from "./supabase/supabase";

export async function fetchActiveBranches() {
  const { data, error } = await supabase
    .from("branches")
    .select("id, name, status")
    .eq("status", "active")
    .order("name");

  if (error) throw error;
  return data;
}

export async function getOperatingHours(branchId) {
  const { data, error } = await supabase
    .from("operating_hours")
    .select("*")
    .eq("branch_id", branchId)
    .order("day_of_week");

  if (error) throw error;
  return data;
}

export async function getClinicClosures(branchId, startDate, endDate) {
  let query = supabase
    .from("clinic_closures")
    .select("*")
    .eq("branch_id", branchId)
    .eq("is_cancelled", false)
    .eq("affects_booking", true);

  if (startDate) {
    query = query.gte("start_date", startDate);
  }
  if (endDate) {
    query = query.lte("end_date", endDate);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
