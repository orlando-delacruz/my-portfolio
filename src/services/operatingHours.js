// src/services/operatingHours.js
import { supabase } from "./supabase/supabase";

const TABLE = "operating_hours";

export async function fetchOperatingHours(branchId) {
  if (!branchId) throw new Error("Branch ID is required");
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("branch_id", branchId)
    .order("day_of_week", { ascending: true });

  if (error) {
    console.error("fetchOperatingHours error:", error);
    throw error; // throw the actual error
  }

  const days = [0, 1, 2, 3, 4, 5, 6];
  const hoursMap = {};
  (data || []).forEach((h) => { hoursMap[h.day_of_week] = h; });

  return days.map((day) => {
    const existing = hoursMap[day];
    if (existing) {
      return {
        id: existing.id,
        dayOfWeek: day,
        openTime: existing.open_time,
        closeTime: existing.close_time,
        breakStartTime: existing.break_start_time,
        breakEndTime: existing.break_end_time,
        isClosed: existing.is_closed,
        branchId: existing.branch_id,
      };
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

export async function updateOperatingHours(branchId, hours) {
  if (!branchId) throw new Error("Branch ID is required");
  if (!hours || !Array.isArray(hours)) {
    throw new Error("Hours must be an array");
  }

  // Delete existing
  const { error: deleteError } = await supabase
    .from(TABLE)
    .delete()
    .eq("branch_id", branchId);

  if (deleteError) {
    console.error("DELETE operating_hours error:", deleteError);
    // Throw the actual Supabase error so we know the real issue
    throw deleteError;
  }

  // If no hours, we're done
  if (hours.length === 0) return [];

  // Prepare insert data
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

  const { data, error: insertError } = await supabase
    .from(TABLE)
    .insert(insertData)
    .select();

  if (insertError) {
    console.error("INSERT operating_hours error:", insertError);
    throw insertError;
  }

  return data;
}

export async function seedOperatingHours(branchId) {
  if (!branchId) return;
  const defaultHours = [
    { dayOfWeek: 0, isClosed: true },
    { dayOfWeek: 1, openTime: "09:00:00", closeTime: "17:00:00", isClosed: false },
    { dayOfWeek: 2, openTime: "09:00:00", closeTime: "17:00:00", isClosed: false },
    { dayOfWeek: 3, openTime: "09:00:00", closeTime: "17:00:00", isClosed: false },
    { dayOfWeek: 4, openTime: "09:00:00", closeTime: "17:00:00", isClosed: false },
    { dayOfWeek: 5, openTime: "09:00:00", closeTime: "17:00:00", isClosed: false },
    { dayOfWeek: 6, openTime: "09:00:00", closeTime: "14:00:00", isClosed: false },
  ];
  await updateOperatingHours(branchId, defaultHours);
}