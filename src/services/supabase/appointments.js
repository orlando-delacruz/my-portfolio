import { supabase } from "./supabase";

export async function updateAppointmentStatus(
  appointmentId,
  newApprovalStatus, // "approved" | "rejected" | "waiting"
  newAppointmentStatus, // "scheduled" | "completed" | "cancelled" | "no_show"
  adminId,
) {
  // 1. Update the appointment's status fields
  const updates = {};
  if (newApprovalStatus) updates.approval_status = newApprovalStatus;
  if (newAppointmentStatus) {
    updates.appointment_status = newAppointmentStatus;
    if (newAppointmentStatus === "cancelled")
      updates.cancelled_at = new Date().toISOString();
    if (newAppointmentStatus === "completed")
      updates.completed_at = new Date().toISOString();
  }

  const { error: updateError } = await supabase
    .from("appointments")
    .update(updates)
    .eq("id", appointmentId);
  if (updateError) throw updateError;

  // 2. Log to appointment_logs (replaces appointment_status_history)
  const description = [
    newApprovalStatus && `Approval: ${newApprovalStatus}`,
    newAppointmentStatus && `Status: ${newAppointmentStatus}`,
  ]
    .filter(Boolean)
    .join(", ");

  const { error: logError } = await supabase.from("appointment_logs").insert({
    appointment_id: appointmentId,
    action: "status_update",
    description,
    performed_by: adminId ? "admin" : "system",
    admin_id: adminId ?? null,
  });
  if (logError) throw logError;

  // 3. Log to activity_logs (dashboard feed)
  await supabase.from("activity_logs").insert({
    actor_type: "admin",
    action: "status_update",
    target_type: "appointment",
    target_reference: appointmentId,
    description,
  });
}

export async function createAppointment(appointmentData, adminId) {
  const { data, error } = await supabase
    .from("appointments")
    .insert(appointmentData)
    .select()
    .single();
  if (error) throw error;

  // Log to appointment_logs
  await supabase.from("appointment_logs").insert({
    appointment_id: data.id,
    action: "created",
    description: "Appointment created by admin",
    performed_by: "admin",
    admin_id: adminId ?? null,
  });

  // Log to activity_logs
  await supabase.from("activity_logs").insert({
    actor_type: "admin",
    action: "created",
    target_type: "appointment",
    target_reference: data.id,
    description: `Appointment ${data.reference_number} created`,
  });

  return data;
}
