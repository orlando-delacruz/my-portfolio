// src/services/operatingHours.js
import { supabase } from "./supabase/supabase";

const TABLE = "operating_hours";

/**
 * Convert a database row (snake_case) to frontend format (camelCase)
 */
function toCamelCase(row) {
  return {
    id: row.id,
    dayOfWeek: row.day_of_week,
    openTime: row.open_time,
    closeTime: row.close_time,
    breakStartTime: row.break_start_time,
    breakEndTime: row.break_end_time,
    isClosed: row.is_closed,
    branchId: row.branch_id,
  };
}

/**
 * Fetch operating hours for a specific branch
 * Returns 7 days (0=Sunday, 6=Saturday) in camelCase format
 */
export async function fetchOperatingHours(branchId) {
  if (!branchId) throw new Error("Branch ID is required");

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("branch_id", branchId)
    .order("day_of_week", { ascending: true });

  if (error) {
    console.error("fetchOperatingHours error:", error);
    throw error;
  }

  const days = [0, 1, 2, 3, 4, 5, 6];
  const hoursMap = {};
  (data || []).forEach((h) => {
    hoursMap[h.day_of_week] = h;
  });

  return days.map((day) => {
    const existing = hoursMap[day];
    if (existing) {
      return toCamelCase(existing);
    }
    return {
      id: null,
      dayOfWeek: day,
      openTime: null,
      closeTime: null,
      breakStartTime: null,
      breakEndTime: null,
      isClosed: true,
      branchId,
    };
  });
}

/**
 * Update operating hours for a branch (delete + insert)
 * Returns the updated data in camelCase format
 */
export async function updateOperatingHours(branchId, hours) {
  if (!branchId) throw new Error("Branch ID is required");
  if (!hours || !Array.isArray(hours)) {
    throw new Error("Hours must be an array");
  }

  // Delete existing hours
  const { error: deleteError } = await supabase
    .from(TABLE)
    .delete()
    .eq("branch_id", branchId);

  if (deleteError) {
    console.error("DELETE operating_hours error:", deleteError);
    throw deleteError;
  }

  if (hours.length === 0) return [];

  // Prepare insert data with snake_case keys
  const insertData = hours.map((h) => ({
    branch_id: branchId,
    day_of_week: h.dayOfWeek,
    open_time: h.isClosed ? null : h.openTime || null,
    close_time: h.isClosed ? null : h.closeTime || null,
    break_start_time: h.breakStartTime || null,
    break_end_time: h.breakEndTime || null,
    is_closed: h.isClosed !== undefined ? h.isClosed : true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  // Insert new hours and select the inserted rows
  const { data, error: insertError } = await supabase
    .from(TABLE)
    .insert(insertData)
    .select();

  if (insertError) {
    console.error("INSERT operating_hours error:", insertError);
    throw insertError;
  }

  // Transform the returned rows to camelCase
  return (data || []).map(toCamelCase);
}

/**
 * Seed default operating hours for a new branch
 * Correct schedule:
 *   Sunday:    10:30 AM – 5:00 PM
 *   Monday:    10:30 AM – 5:00 PM
 *   Tuesday:   Closed
 *   Wednesday: 10:30 AM – 5:00 PM
 *   Thursday:  10:30 AM – 5:00 PM
 *   Friday:    10:30 AM – 4:00 PM
 *   Saturday:  Closed
 */
export async function seedOperatingHours(branchId) {
  if (!branchId) return;

  const defaultHours = [
    { dayOfWeek: 0, openTime: "10:30:00", closeTime: "17:00:00", isClosed: false },
    { dayOfWeek: 1, openTime: "10:30:00", closeTime: "17:00:00", isClosed: false },
    { dayOfWeek: 2, openTime: null, closeTime: null, isClosed: true },
    { dayOfWeek: 3, openTime: "10:30:00", closeTime: "17:00:00", isClosed: false },
    { dayOfWeek: 4, openTime: "10:30:00", closeTime: "17:00:00", isClosed: false },
    { dayOfWeek: 5, openTime: "10:30:00", closeTime: "16:00:00", isClosed: false },
    { dayOfWeek: 6, openTime: null, closeTime: null, isClosed: true },
  ];

  await updateOperatingHours(branchId, defaultHours);
}