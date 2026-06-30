import { supabase } from "./supabase/supabase";

// Maps the simplified form status to the schema's split status columns
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

const MIN_INTERVAL_MINUTES = 60;

function timeToMinutes(timeStr) {
  // timeStr like "14:30:00" or "14:30"
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Checks whether a requested date/time at a branch conflicts with an
 * existing (non-cancelled) appointment within MIN_INTERVAL_MINUTES.
 *
 * @param {string} branchId
 * @param {dayjs.Dayjs} date
 * @param {dayjs.Dayjs} time
 * @param {string} [excludeAppointmentId] - skip this appointment (for reschedule)
 * @returns {Promise<boolean>} true if there IS a conflict
 */
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
    return Math.abs(existingMinutes - requestedMinutes) < MIN_INTERVAL_MINUTES;
  });
}

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

  await supabase.from("appointment_logs").insert({
    appointment_id: data.id,
    action: "created",
    description: "Appointment created by admin",
    performed_by: "admin",
    admin_id: adminId ?? null,
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

  await supabase.from("appointment_logs").insert({
    appointment_id: appointmentId,
    action: "rescheduled",
    description: "Appointment rescheduled by admin",
    performed_by: "admin",
    admin_id: adminId ?? null,
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
  });

  return data;
}
