// src/services/clinicClosures.js
import { supabase } from "./supabase/supabase";
import dayjs from "dayjs";

/**
 * Fetch clinic closures with filters, pagination, and computed status
 */
export async function fetchClinicClosures({
  page = 1,
  pageSize = 10,
  search = "",
  branchId = null,
  closureType = null,
  status = null,
}) {
  // Start with base query
  let query = supabase.from("clinic_closures").select(
    `
      *,
      branch:branches(id, name)
    `,
    { count: "exact" },
  );

  // Apply filters
  if (search.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(`title.ilike.${term},reason.ilike.${term}`);
  }

  if (branchId && branchId !== "all") {
    query = query.eq("branch_id", branchId);
  }

  if (closureType && closureType !== "all") {
    query = query.eq("closure_type", closureType);
  }

  // Order by start_date descending
  query = query.order("start_date", { ascending: false });

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error } = await query;
  if (error) throw error;

  // Compute status for each closure
  const now = dayjs();
  const today = now.startOf("day");
  const closuresWithStatus = (data || []).map((c) => {
    let computedStatus = "scheduled";
    if (c.is_cancelled) {
      computedStatus = "cancelled";
    } else {
      const start = dayjs(c.start_date);
      const end = dayjs(c.end_date);
      if (start <= today && today <= end) {
        computedStatus = "active";
      } else if (end < today) {
        computedStatus = "past";
      }
    }
    return { ...c, computed_status: computedStatus };
  });

  // Apply status filter if needed
  let filtered = closuresWithStatus;
  if (status && status !== "all") {
    filtered = closuresWithStatus.filter((c) => c.computed_status === status);
  }

  return {
    data: filtered,
    count: filtered.length,
  };
}

/**
 * Create a new clinic closure
 */
export async function createClinicClosure(data) {
  const { data: result, error } = await supabase
    .from("clinic_closures")
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return result;
}

/**
 * Update an existing clinic closure
 */
export async function updateClinicClosure(id, data) {
  const { data: result, error } = await supabase
    .from("clinic_closures")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return result;
}

/**
 * Delete a clinic closure
 */
export async function deleteClinicClosure(id) {
  const { error } = await supabase
    .from("clinic_closures")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
