// src/services/publicBooking.js
import { supabase } from "./supabase/supabase";
import dayjs from "dayjs";
import { hasBookingConflict, STATUS_TO_DB } from "./appointments";
import { findOrCreatePatient } from "./patients";
import { fetchServiceBranchById } from "./serviceBranches";

const DEFAULT_INTERVAL = 15;

function isPastAppointment(date, time) {
  const now = dayjs();
  const appointmentDateTime = dayjs(date)
    .hour(time.hour())
    .minute(time.minute())
    .second(0);
  return appointmentDateTime.isBefore(now);
}

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

  const dateObj = dayjs(date);
  const timeObj = dayjs(time, "HH:mm:ss");
  if (!dateObj.isValid()) {
    throw new Error("Invalid date format. Please select a valid date.");
  }
  if (!timeObj.isValid()) {
    throw new Error("Invalid time format. Please select a valid time.");
  }

  // 2. Prevent past appointments
  if (isPastAppointment(dateObj, timeObj)) {
    throw new Error(
      "The selected appointment time has already passed. Please choose a future time."
    );
  }

  // ── 3. Validate against clinic closures ──
  const dateStr = dateObj.format("YYYY-MM-DD");
  const timeStr = timeObj.format("HH:mm:ss");

  const { data: closure, error: closureError } = await supabase
    .from("clinic_closures")
    .select("*")
    .eq("branch_id", branchId)
    .eq("is_cancelled", false)
    .eq("affects_booking", true)
    .lte("start_date", dateStr)
    .gte("end_date", dateStr)
    .maybeSingle();

  if (closureError) {
    console.error("Closure check error:", closureError);
    throw new Error("Unable to verify availability. Please try again.");
  }

  if (closure) {
    if (closure.is_all_day) {
      throw new Error("The clinic is closed on this date. Please choose another date.");
    } else {
      const closureStart = closure.start_time;
      const closureEnd = closure.end_time;
      if (timeStr >= closureStart && timeStr <= closureEnd) {
        throw new Error("The selected time is within a clinic closure period. Please choose another time.");
      }
    }
  }

  // 4. Check conflict with fixed 15-minute interval
  const conflict = await hasBookingConflict({
    date: dateObj,
    time: timeObj,
    branchId: branchId,
    intervalMinutes: DEFAULT_INTERVAL,
  });

  if (conflict) {
    throw new Error(
      `The selected time is too close to an existing appointment. Please choose a time at least ${DEFAULT_INTERVAL} minutes apart.`
    );
  }

  // 5. Find or create patient
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

  // 6. Fetch service branch details for snapshot
  const serviceBranch = await fetchServiceBranchById(serviceBranchId);

  // 7. Generate reference number
  const dateStrForRef = dateObj.format("YYYY-MM-DD");
  const { data: refNumber, error: refError } = await supabase.rpc(
    "generate_reference_number",
    { p_date: dateStrForRef }
  );

  if (refError) {
    console.error("Reference number generation error:", refError);
    throw new Error("Failed to generate reference number. Please try again.");
  }

  // 8. Insert appointment – Pending
  const { approval_status, appointment_status } = STATUS_TO_DB.pending;
  const { data: appointment, error: insertErr } = await supabase
    .from("appointments")
    .insert({
      reference_number: refNumber,
      patient_id: patient.id,
      service_branch_id: serviceBranchId,
      booked_by: "website",
      preferred_date: dateObj.format("YYYY-MM-DD"),
      preferred_time: timeObj.format("HH:mm:ss"),
      chief_complaint: notes || null,
      snapshot_service_name: serviceBranch.name,
      snapshot_duration_minutes: DEFAULT_INTERVAL,
      snapshot_starting_price: serviceBranch.starting_price,
      snapshot_maximum_price: serviceBranch.maximum_price,
      approval_status,
      appointment_status,
    })
    .select()
    .single();

  if (insertErr) throw insertErr;

  // 9. Log the activity
  await supabase.from("appointment_logs").insert({
    appointment_id: appointment.id,
    action: "created",
    description: "Appointment booked via website",
    performed_by: "system",
    admin_id: null,
    status: "pending",
  });

  return appointment;
}