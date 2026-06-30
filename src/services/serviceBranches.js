// src/services/serviceBranches.js
import { supabase } from "./supabase/supabase";

export async function fetchServicesForBranch(branchId) {
  if (!branchId) return [];

  const { data, error } = await supabase
    .from("service_branches")
    .select(
      `id, price, duration_minutes, status, online_booking_enabled, services ( id, name )`,
    )
    .eq("branch_id", branchId)
    .eq("status", "active")
    .eq("online_booking_enabled", true);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    service_branch_id: row.id,
    name: row.services?.name,
    price: row.price,
    duration_minutes: row.duration_minutes,
  }));
}

export async function fetchServiceBranchById(id) {
  const { data, error } = await supabase
    .from("service_branches")
    .select(`id, branch_id, price, duration_minutes, services ( name )`)
    .eq("id", id)
    .single();

  if (error) throw error;

  return {
    service_branch_id: data.id,
    branch_id: data.branch_id,
    name: data.services?.name,
    price: data.price,
    duration_minutes: data.duration_minutes,
  };
}
