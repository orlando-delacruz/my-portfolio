// src/services/publicBooking.js
import { supabase } from "./supabase/supabase";
import { hasBookingConflict, STATUS_TO_DB } from "./appointments";
import { findOrCreatePatient } from "./patients";
import { fetchServiceBranchById } from "./serviceBranches";
import dayjs from "dayjs";

/**
 * Book a new appointment from the public website
 */
export async function bookPublicAppointment({
  firstName,
  middleName,
  lastName,
  birthDate,
  gender,
  email,
  phoneNumber,
  address,
  branchId,
  serviceBranchId,
  date,
  time,
  notes,
}) {
  // 1. Validate required fields
  if (
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !branchId ||
    !serviceBranchId ||
    !date ||
    !time
  ) {
    throw new Error("Missing required fields.");
  }

  // 2. Validate date and time strings
  const dateObj = dayjs(date);
  const timeObj = dayjs(time, "HH:mm:ss");
  if (!dateObj.isValid()) {
    throw new Error("Invalid date format. Please select a valid date.");
  }
  if (!timeObj.isValid()) {
    throw new Error("Invalid time format. Please select a valid time.");
  }

  // 3. Check conflict (1-hour buffer)
  const conflict = await hasBookingConflict({
    branchId,
    date: dateObj,
    time: timeObj,
  });

  if (conflict) {
    throw new Error(
      "The selected time is too close to an existing appointment. Please choose a time at least 60 minutes apart.",
    );
  }

  // 4. Find or create patient
  const patient = await findOrCreatePatient({
    firstName,
    middleName,
    lastName,
    birthDate,
    gender,
    email,
    phoneNumber,
    address,
  });

  // 5. Fetch service branch details for snapshot
  const serviceBranch = await fetchServiceBranchById(serviceBranchId);

  // 6. Generate reference number
  const dateStr = dateObj.format("YYYYMMDD");
  const { count, error: countErr } = await supabase
    .from("appointments")
    .select("id", { count: "exact", head: true })
    .like("reference_number", `REF-${dateStr}-%`);

  if (countErr) throw countErr;
  const seq = String((count ?? 0) + 1).padStart(3, "0");
  const referenceNumber = `REF-${dateStr}-${seq}`;

  // 7. Insert appointment
  const { approval_status, appointment_status } = STATUS_TO_DB.pending;
  const { data: appointment, error: insertErr } = await supabase
    .from("appointments")
    .insert({
      reference_number: referenceNumber,
      patient_id: patient.id,
      service_branch_id: serviceBranchId,
      booked_by: "website",
      preferred_date: dateObj.format("YYYY-MM-DD"),
      preferred_time: timeObj.format("HH:mm:ss"),
      chief_complaint: notes || null,
      snapshot_service_name: serviceBranch.name,
      snapshot_price: serviceBranch.price,
      snapshot_duration_minutes: serviceBranch.duration_minutes,
      approval_status,
      appointment_status,
    })
    .select()
    .single();

  if (insertErr) throw insertErr;

  // 8. Log the activity
  await supabase.from("appointment_logs").insert({
    appointment_id: appointment.id,
    action: "created",
    description: "Appointment booked via website",
    performed_by: "system",
    admin_id: null,
  });

  return appointment;
}
