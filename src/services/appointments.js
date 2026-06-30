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
  date,
  time,
  status,
  adminId,
}) {
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
