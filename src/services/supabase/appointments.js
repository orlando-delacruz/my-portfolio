// src/lib/appointments.js
import { supabase } from "./supabase";

export async function updateAppointmentStatus(
  appointmentId,
  oldStatus,
  newStatus,
  changedBy,
) {
  // 1. Update the appointment
  const { error: updateError } = await supabase
    .from("appointments")
    .update({ status: newStatus })
    .eq("id", appointmentId);
  if (updateError) throw updateError;

  // 2. Insert into status history
  const { error: historyError } = await supabase
    .from("appointment_status_history")
    .insert({
      appointment_id: appointmentId,
      old_status: oldStatus,
      new_status: newStatus,
      changed_by: changedBy,
    });
  if (historyError) throw historyError;

  // 3. Log the activity
  await supabase.from("activity_logs").insert({
    user_id: changedBy,
    action: `Changed appointment status from ${oldStatus} to ${newStatus}`,
    target_type: "appointment",
    target_id: appointmentId,
  });
}

export async function createAppointment(appointmentData, createdBy) {
  const { data, error } = await supabase
    .from("appointments")
    .insert(appointmentData)
    .select()
    .single();
  if (error) throw error;

  // Log the activity
  await supabase.from("activity_logs").insert({
    user_id: createdBy,
    action: "Created appointment",
    target_type: "appointment",
    target_id: data.id,
  });

  return data;
}
