// src/services/appointments.js
import { supabase } from "./supabase/supabase";
import dayjs from "dayjs";
import { getOperatingHoursForDay } from "../utils/scheduling";

const DEFAULT_INTERVAL = 15;

// ── Status Mapping ──
export const STATUS_TO_DB = {
  pending: { approval_status: "waiting", appointment_status: "scheduled" },
  confirmed: { approval_status: "approved", appointment_status: "scheduled" },
  completed: { approval_status: "approved", appointment_status: "completed" },
  cancelled: { approval_status: "approved", appointment_status: "cancelled" },
};

export function dbStatusToForm(approval_status, appointment_status) {
  if (appointment_status === "cancelled") return "cancelled";
  if (appointment_status === "completed") return "completed";
  if (approval_status === "approved") return "confirmed";
  return "pending";
}

// ── Helpers ──
function timeToMinutes(timeStr) {
  if (!timeStr) return NaN;
  const parts = timeStr.split(":").map(Number);
  if (parts.length < 2) return NaN;
  return parts[0] * 60 + parts[1];
}

function formatMinutesToTime(minutes) {
  if (minutes < 0) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
  return dayjs(`2000-01-01T${timeStr}`).format("h:mm A");
}

// ── Conflict Check ──
export async function hasBookingConflict({
  date,
  time,
  excludeAppointmentId,
  branchId,
  intervalMinutes = DEFAULT_INTERVAL,
}) {
  const dateStr = date.format("YYYY-MM-DD");
  const requestedMinutes = time.hour() * 60 + time.minute();

  let query = supabase
    .from("appointments")
    .select(
      `
      id,
      preferred_time,
      confirmed_time,
      appointment_status,
      approval_status,
      service_branch:service_branches(branch_id)
    `
    )
    .or(`preferred_date.eq.${dateStr},confirmed_date.eq.${dateStr}`)
    .eq("approval_status", "approved")
    .eq("appointment_status", "scheduled")
    .neq("appointment_status", "cancelled");

  if (branchId) {
    query = query.eq("service_branch.branch_id", branchId);
  }

  if (excludeAppointmentId) {
    query = query.neq("id", excludeAppointmentId);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).some((apt) => {
    const existingTimeStr = apt.confirmed_time ?? apt.preferred_time;
    if (!existingTimeStr) return false;
    const existingMinutes = timeToMinutes(existingTimeStr);
    if (isNaN(existingMinutes)) return false;
    return Math.abs(existingMinutes - requestedMinutes) < intervalMinutes;
  });
}

export async function getConflictingAppointments({
  date,
  time,
  excludeAppointmentId,
  branchId,
  intervalMinutes = DEFAULT_INTERVAL,
}) {
  const dateStr = dayjs(date).format("YYYY-MM-DD");
  const requestedMinutes = time.hour() * 60 + time.minute();

  let query = supabase
    .from("appointments")
    .select(
      `
      id,
      preferred_time,
      confirmed_time,
      appointment_status,
      approval_status,
      service_branch:service_branches(branch_id)
    `
    )
    .or(`preferred_date.eq.${dateStr},confirmed_date.eq.${dateStr}`)
    .eq("approval_status", "approved")
    .eq("appointment_status", "scheduled")
    .neq("appointment_status", "cancelled");

  if (branchId) {
    query = query.eq("service_branch.branch_id", branchId);
  }

  if (excludeAppointmentId) {
    query = query.neq("id", excludeAppointmentId);
  }

  const { data, error } = await query;
  if (error) throw error;

  const conflicts = (data ?? []).filter((apt) => {
    const existingTimeStr = apt.confirmed_time ?? apt.preferred_time;
    if (!existingTimeStr) return false;
    const existingMinutes = timeToMinutes(existingTimeStr);
    if (isNaN(existingMinutes)) return false;
    return Math.abs(existingMinutes - requestedMinutes) < intervalMinutes;
  });

  return conflicts.map((apt) => ({
    id: apt.id,
    time: apt.confirmed_time ?? apt.preferred_time,
  }));
}

export async function checkBookingConflictWithDetails({
  branchId,
  date,
  time,
  excludeAppointmentId,
  intervalMinutes = DEFAULT_INTERVAL,
}) {
  const conflicts = await getConflictingAppointments({
    date,
    time,
    excludeAppointmentId,
    branchId,
    intervalMinutes,
  });
  const hasConflict = conflicts.length > 0;

  if (!hasConflict) {
    return {
      hasConflict: false,
      conflicts: [],
      conflictTime: null,
      previousAvailableTime: null,
      nextAvailableTime: null,
    };
  }

  const sorted = conflicts.sort((a, b) => a.time.localeCompare(b.time));
  const conflictTime = sorted[0].time;
  const conflictMinutes = timeToMinutes(conflictTime);
  const requestedMinutes = time.hour() * 60 + time.minute();
  const interval = intervalMinutes;

  let previousAvailableTime = null;
  let nextAvailableTime = null;

  if (!isNaN(conflictMinutes)) {
    if (requestedMinutes > conflictMinutes) {
      const afterMinutes = conflictMinutes + interval;
      nextAvailableTime = formatMinutesToTime(afterMinutes);
    } else {
      const beforeMinutes = conflictMinutes - interval;
      if (beforeMinutes >= 0) {
        previousAvailableTime = formatMinutesToTime(beforeMinutes);
      }
    }
  }

  try {
    const hours = await getOperatingHoursForDay(branchId, date);
    if (!hours.isClosed && hours.openTime && hours.closeTime) {
      const openMinutes = timeToMinutes(hours.openTime);
      const closeMinutes = timeToMinutes(hours.closeTime);

      if (!isNaN(openMinutes) && !isNaN(closeMinutes)) {
        if (previousAvailableTime) {
          const prevMinutes = timeToMinutes(
            dayjs(previousAvailableTime, "h:mm A").format("HH:mm:ss")
          );
          if (prevMinutes < openMinutes || prevMinutes > closeMinutes) {
            previousAvailableTime = null;
          }
        }
        if (nextAvailableTime) {
          const nextMinutes = timeToMinutes(
            dayjs(nextAvailableTime, "h:mm A").format("HH:mm:ss")
          );
          if (nextMinutes < openMinutes || nextMinutes > closeMinutes) {
            nextAvailableTime = null;
          }
        }
      }
    }
  } catch (e) {
    console.warn(
      "Could not fetch operating hours for filtering suggestions:",
      e
    );
  }

  return {
    hasConflict: true,
    conflicts: sorted,
    conflictTime: dayjs(`2000-01-01T${conflictTime}`).format("h:mm A"),
    previousAvailableTime,
    nextAvailableTime,
  };
}

// ── Appointment Creation ──
const SELECT_WITH_RELATIONS = `*, patients(first_name,last_name,phone_number), service_branches(branch_id, services(name))`;

export async function adminCreateAppointment({
  patient,
  serviceBranch,
  date,
  time,
  adminId,
  intervalMinutes = DEFAULT_INTERVAL,
  isWalkIn = false,
}) {
  if (isPastAppointment(date, time)) {
    throw new Error(
      "The selected appointment time has already passed. Please choose a future time."
    );
  }

  const conflict = await hasBookingConflict({
    date,
    time,
    branchId: serviceBranch.branch_id,
    intervalMinutes,
  });
  if (conflict) {
    throw new Error(
      `That time slot is too close to an existing appointment. Please choose a time at least ${intervalMinutes} minutes apart.`
    );
  }

  const dateStr = date.format("YYYY-MM-DD");
  const { data: refNumber, error: refError } = await supabase.rpc(
    "generate_reference_number",
    { p_date: dateStr }
  );

  if (refError) {
    console.error("Reference number generation error:", refError);
    throw new Error("Failed to generate reference number. Please try again.");
  }

  const { approval_status, appointment_status } = STATUS_TO_DB.confirmed;

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      reference_number: refNumber,
      patient_id: patient.id,
      service_branch_id: serviceBranch.service_branch_id,
      booked_by: isWalkIn ? "walk-in" : "admin",
      is_walk_in: isWalkIn,
      preferred_date: date.format("YYYY-MM-DD"),
      preferred_time: time.format("HH:mm:ss"),
      snapshot_service_name: serviceBranch.name,
      snapshot_price: serviceBranch.price,
      snapshot_starting_price: serviceBranch.starting_price,
      snapshot_maximum_price: serviceBranch.maximum_price,
      snapshot_duration_minutes: intervalMinutes,
      approval_status,
      appointment_status,
    })
    .select(SELECT_WITH_RELATIONS)
    .single();

  if (error) throw error;

  const logStatus = dbStatusToForm(approval_status, appointment_status);

  await supabase.from("appointment_logs").insert({
    appointment_id: data.id,
    action: "created",
    description: "Appointment created by admin",
    performed_by: "admin",
    admin_id: adminId ?? null,
    status: logStatus,
  });

  return data;
}

// ── Reschedule ──
export async function adminRescheduleAppointment({
  appointmentId,
  date,
  time,
  status,
  adminId,
  intervalMinutes = DEFAULT_INTERVAL,
}) {
  if (isPastAppointment(date, time)) {
    throw new Error(
      "The selected appointment time has already passed. Please choose a future time."
    );
  }

  const { data: apt, error: aptError } = await supabase
    .from("appointments")
    .select("service_branch:service_branches(branch_id)")
    .eq("id", appointmentId)
    .single();
  if (aptError) throw aptError;
  const branchId = apt?.service_branch?.branch_id;

  const conflict = await hasBookingConflict({
    date,
    time,
    excludeAppointmentId: appointmentId,
    branchId,
    intervalMinutes,
  });

  if (conflict) {
    throw new Error(
      `That time slot is too close to an existing appointment. Please choose a time at least ${intervalMinutes} minutes apart.`
    );
  }

  const { approval_status, appointment_status } =
    STATUS_TO_DB[status] ?? STATUS_TO_DB.pending;

  const { data, error } = await supabase
    .from("appointments")
    .update({
      confirmed_date: date.format("YYYY-MM-DD"),
      confirmed_time: time.format("HH:mm:ss"),
      approval_status,
      appointment_status,
    })
    .eq("id", appointmentId)
    .select(SELECT_WITH_RELATIONS)
    .single();

  if (error) throw error;

  const logStatus = dbStatusToForm(approval_status, appointment_status);

  await supabase.from("appointment_logs").insert({
    appointment_id: appointmentId,
    action: "rescheduled",
    description: "Appointment rescheduled by admin",
    performed_by: "admin",
    admin_id: adminId ?? null,
    status: logStatus,
  });

  return data;
}

// ── Status Update ──
export async function adminUpdateAppointmentStatus({
  appointmentId,
  status,
  adminId,
}) {
  const { approval_status, appointment_status } =
    STATUS_TO_DB[status] ?? STATUS_TO_DB.pending;

  const extra = {};
  if (appointment_status === "cancelled")
    extra.cancelled_at = new Date().toISOString();
  if (appointment_status === "completed")
    extra.completed_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("appointments")
    .update({ approval_status, appointment_status, ...extra })
    .eq("id", appointmentId)
    .select(SELECT_WITH_RELATIONS)
    .single();

  if (error) throw error;

  await supabase.from("appointment_logs").insert({
    appointment_id: appointmentId,
    action: "status_changed",
    description: `Status set to ${status}`,
    performed_by: "admin",
    admin_id: adminId ?? null,
    status,
  });

  return data;
}

// ── Bulk Delete ──
export async function adminBulkDeleteAppointments(appointmentIds, adminId) {
  if (!appointmentIds || appointmentIds.length === 0) {
    return;
  }

  if (adminId) {
    const logEntries = appointmentIds.map((id) => ({
      appointment_id: id,
      action: "bulk_deleted",
      description: `Bulk deleted ${appointmentIds.length} appointment(s)`,
      performed_by: "admin",
      admin_id: adminId,
      status: null,
    }));

    const { error: logError } = await supabase
      .from("appointment_logs")
      .insert(logEntries);

    if (logError) {
      console.error("Failed to log bulk deletion:", logError);
    }
  }

  const { error: deleteError } = await supabase
    .from("appointments")
    .delete()
    .in("id", appointmentIds);

  if (deleteError) throw deleteError;
}

// ── Get single appointment ──
export async function getAppointmentById(appointmentId) {
  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      patient:patients(*),
      service_branch:service_branches(
        *,
        branch:branches(*),
        service:services(*)
      )
    `
    )
    .eq("id", appointmentId)
    .single();

  if (error) throw error;
  return data;
}

// ── Helper ──
function isPastAppointment(date, time) {
  const now = dayjs();
  const appointmentDateTime = dayjs(date)
    .hour(time.hour())
    .minute(time.minute())
    .second(0);
  return appointmentDateTime.isBefore(now);
}