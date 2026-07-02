// src/services/appointments.js
import { supabase } from "./supabase/supabase";
import dayjs from "dayjs";
import { getOperatingHoursForDay } from "../utils/scheduling";

// ── Constants ──
const MIN_INTERVAL_MINUTES = 60;

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
  const parts = timeStr.split(":");
  if (parts.length !== 3) return NaN;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return NaN;
  return h * 60 + m;
}

// ── Original Conflict Check ──
export async function hasBookingConflict({
  branchId,
  date,
  time,
  excludeAppointmentId,
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
      service_branch:service_branches!inner(branch_id)
    `,
    )
    .eq("service_branch.branch_id", branchId)
    .or(`preferred_date.eq.${dateStr},confirmed_date.eq.${dateStr}`)
    .eq("approval_status", "approved")
    .eq("appointment_status", "scheduled")
    .neq("appointment_status", "cancelled");

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
    return Math.abs(existingMinutes - requestedMinutes) < MIN_INTERVAL_MINUTES;
  });
}

// ── Appointment Creation ──
async function generateReferenceNumber(dateStr) {
  const { count, error } = await supabase
    .from("appointments")
    .select("id", { count: "exact", head: true })
    .like("reference_number", `REF-${dateStr}-%`);

  if (error) throw error;
  const seq = String((count ?? 0) + 1).padStart(3, "0");
  return `REF-${dateStr}-${seq}`;
}

const SELECT_WITH_RELATIONS = `*, patients(first_name,last_name,phone_number), service_branches(branch_id, services(name))`;

export async function adminCreateAppointment({
  patient,
  serviceBranch,
  date,
  time,
  adminId,
}) {
  const conflict = await hasBookingConflict({
    branchId: serviceBranch.branch_id,
    date,
    time,
  });

  if (conflict) {
    throw new Error(
      `That time slot is too close to an existing appointment. Please choose a time at least ${MIN_INTERVAL_MINUTES} minutes apart.`,
    );
  }

  const dateStr = date.format("YYYYMMDD");
  const reference_number = await generateReferenceNumber(dateStr);
  const { approval_status, appointment_status } = STATUS_TO_DB.pending;

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      reference_number,
      patient_id: patient.id,
      service_branch_id: serviceBranch.service_branch_id,
      booked_by: "admin",
      preferred_date: date.format("YYYY-MM-DD"),
      preferred_time: time.format("HH:mm:ss"),
      snapshot_service_name: serviceBranch.name,
      snapshot_price: serviceBranch.price,
      snapshot_duration_minutes: serviceBranch.duration_minutes,
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

export async function adminRescheduleAppointment({
  appointmentId,
  branchId,
  date,
  time,
  status,
  adminId,
}) {
  const conflict = await hasBookingConflict({
    branchId,
    date,
    time,
    excludeAppointmentId: appointmentId,
  });

  if (conflict) {
    throw new Error(
      `That time slot is too close to an existing appointment. Please choose a time at least ${MIN_INTERVAL_MINUTES} minutes apart.`,
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

export async function adminBulkDeleteAppointments(appointmentIds, adminId) {
  if (!appointmentIds || appointmentIds.length === 0) {
    return;
  }

  const { error: deleteError } = await supabase
    .from("appointments")
    .delete()
    .in("id", appointmentIds);

  if (deleteError) throw deleteError;

  if (adminId) {
    const { error: logError } = await supabase.from("appointment_logs").insert({
      appointment_id: null,
      action: "bulk_deleted",
      description: `Bulk deleted ${appointmentIds.length} appointment(s)`,
      performed_by: "admin",
      admin_id: adminId,
      status: null,
    });

    if (logError) {
      console.error("Failed to log bulk deletion:", logError);
    }
  }
}

// ── Conflict Details Functions ──
export async function getConflictingAppointments({
  branchId,
  date,
  time,
  excludeAppointmentId,
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
      service_branch:service_branches!inner(branch_id)
    `,
    )
    .eq("service_branch.branch_id", branchId)
    .or(`preferred_date.eq.${dateStr},confirmed_date.eq.${dateStr}`)
    .eq("approval_status", "approved")
    .eq("appointment_status", "scheduled")
    .neq("appointment_status", "cancelled");

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
    return Math.abs(existingMinutes - requestedMinutes) < MIN_INTERVAL_MINUTES;
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
}) {
  const conflicts = await getConflictingAppointments({
    branchId,
    date,
    time,
    excludeAppointmentId,
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
  const interval = MIN_INTERVAL_MINUTES;

  // Fetch operating hours (if available)
  let openMinutes = null;
  let closeMinutes = null;
  try {
    const hours = await getOperatingHoursForDay(branchId, date);
    if (!hours.isClosed && hours.openTime && hours.closeTime) {
      openMinutes = timeToMinutes(hours.openTime);
      closeMinutes = timeToMinutes(hours.closeTime);
    }
  } catch (e) {
    console.warn("Could not fetch operating hours for suggestions:", e);
  }

  let previousAvailableTime = null;
  let nextAvailableTime = null;

  // Ensure conflictMinutes is valid
  if (!isNaN(conflictMinutes)) {
    if (requestedMinutes > conflictMinutes) {
      // Requested after conflict → next = conflict + interval
      const afterMinutes = conflictMinutes + interval;
      const withinHours =
        (openMinutes === null || afterMinutes > openMinutes) &&
        (closeMinutes === null || afterMinutes < closeMinutes);
      if (withinHours) {
        const afterHour = Math.floor(afterMinutes / 60);
        const afterMin = afterMinutes % 60;
        const afterTime = `${String(afterHour).padStart(2, "0")}:${String(afterMin).padStart(2, "0")}:00`;
        nextAvailableTime = dayjs(`2000-01-01T${afterTime}`).format("h:mm A");
      }
    } else {
      // Requested before conflict → previous = conflict - interval
      const beforeMinutes = conflictMinutes - interval;
      const withinHours =
        (openMinutes === null || beforeMinutes >= openMinutes) &&
        (closeMinutes === null || beforeMinutes <= closeMinutes);
      if (withinHours) {
        const beforeHour = Math.floor(beforeMinutes / 60);
        const beforeMin = beforeMinutes % 60;
        const beforeTime = `${String(beforeHour).padStart(2, "0")}:${String(beforeMin).padStart(2, "0")}:00`;
        previousAvailableTime = dayjs(`2000-01-01T${beforeTime}`).format(
          "h:mm A",
        );
      }
    }
  }

  return {
    hasConflict: true,
    conflicts: sorted,
    conflictTime: dayjs(`2000-01-01T${conflictTime}`).format("h:mm A"),
    previousAvailableTime,
    nextAvailableTime,
  };
}

// ── Get single appointment by ID (full details) ──
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
    `,
    )
    .eq("id", appointmentId)
    .single();

  if (error) throw error;
  return data;
}
