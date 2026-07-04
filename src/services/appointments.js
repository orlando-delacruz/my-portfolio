// src/services/appointments.js
import { supabase } from "./supabase/supabase";
import dayjs from "dayjs";
import { getOperatingHoursForDay } from "../utils/scheduling";
import { triggerConfirmation } from "./trigger"; // <-- NEW

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
  const parts = timeStr.split(":").map(Number);
  if (parts.length < 2) return NaN;
  const h = parts[0];
  const m = parts[1];
  if (isNaN(h) || isNaN(m)) return NaN;
  return h * 60 + m;
}

function formatMinutesToTime(minutes) {
  if (minutes < 0) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
  return dayjs(`2000-01-01T${timeStr}`).format("h:mm A");
}

// ── Global Conflict Check ──
export async function hasBookingConflict({ date, time, excludeAppointmentId }) {
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
      approval_status
    `,
    )
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

// ── Past-time validation ──
function isPastAppointment(date, time) {
  const now = dayjs();
  const appointmentDateTime = dayjs(date)
    .hour(time.hour())
    .minute(time.minute())
    .second(0);
  return appointmentDateTime.isBefore(now);
}

// ── Appointment Creation ──
const SELECT_WITH_RELATIONS = `*, patients(first_name,last_name,phone_number), service_branches(branch_id, services(name))`;

export async function adminCreateAppointment({
  patient,
  serviceBranch,
  date,
  time,
  adminId,
}) {
  // 1. Prevent past appointments
  if (isPastAppointment(date, time)) {
    throw new Error(
      "The selected appointment time has already passed. Please choose a future time.",
    );
  }

  // 2. Check conflicts
  const conflict = await hasBookingConflict({ date, time });
  if (conflict) {
    throw new Error(
      `That time slot is too close to an existing appointment. Please choose a time at least ${MIN_INTERVAL_MINUTES} minutes apart.`,
    );
  }

  // 3. Generate reference number atomically via RPC
  const dateStr = date.format("YYYY-MM-DD");
  const { data: refNumber, error: refError } = await supabase.rpc(
    "generate_reference_number",
    { p_date: dateStr },
  );

  if (refError) {
    console.error("Reference number generation error:", refError);
    throw new Error("Failed to generate reference number. Please try again.");
  }

  // Admin-created appointments default to Confirmed
  const { approval_status, appointment_status } = STATUS_TO_DB.confirmed;

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      reference_number: refNumber,
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

  // ── Trigger confirmation email via Trigger.dev ──
  if (patient.email) {
    triggerConfirmation(data.id).catch((err) => {
      console.error("Failed to trigger confirmation:", err);
    });
  }

  return data;
}

export async function adminRescheduleAppointment({
  appointmentId,
  date,
  time,
  status,
  adminId,
}) {
  if (isPastAppointment(date, time)) {
    throw new Error(
      "The selected appointment time has already passed. Please choose a future time.",
    );
  }

  const conflict = await hasBookingConflict({
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

// ── Conflict Details ──
export async function getConflictingAppointments({
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
      approval_status
    `,
    )
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
            dayjs(previousAvailableTime, "h:mm A").format("HH:mm:ss"),
          );
          if (prevMinutes < openMinutes || prevMinutes > closeMinutes) {
            previousAvailableTime = null;
          }
        }
        if (nextAvailableTime) {
          const nextMinutes = timeToMinutes(
            dayjs(nextAvailableTime, "h:mm A").format("HH:mm:ss"),
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
      e,
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

// ── Get single appointment by ID ──
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
