// src/utils/scheduling.js
import dayjs from "dayjs";
import { supabase } from "../services/supabase/supabase";

export async function getOperatingHoursForDay(branchId, date) {
  const dayOfWeek = dayjs(date).day();
  const { data, error } = await supabase
    .from("operating_hours")
    .select("*")
    .eq("branch_id", branchId)
    .eq("day_of_week", dayOfWeek)
    .maybeSingle();

  if (error) {
    console.error("Error fetching operating hours:", error);
    throw error;
  }

  if (!data || data.is_closed) {
    return { isClosed: true };
  }

  return {
    isClosed: false,
    openTime: data.open_time,
    closeTime: data.close_time,
  };
}

export async function isDateClosed(branchId, date) {
  const dateStr = dayjs(date).format("YYYY-MM-DD");
  const { data, error } = await supabase
    .from("clinic_closures")
    .select("id")
    .eq("branch_id", branchId)
    .eq("is_cancelled", false)
    .eq("affects_booking", true)
    .lte("start_date", dateStr)
    .gte("end_date", dateStr)
    .maybeSingle();

  if (error) {
    console.error("Error checking clinic closures:", error);
    return false; // Assume not closed if query fails
  }

  return !!data;
}
