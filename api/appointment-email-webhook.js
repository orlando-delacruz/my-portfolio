// api/appointment-email-webhook.js
/* global process */
// Receives Supabase Database Webhook calls on INSERT/UPDATE to `appointments`.
// Diffing record vs old_record here means adminCreateAppointment, adminUpdateAppointmentStatus,
// adminRescheduleAppointment, bookPublicAppointment and the patient self-cancel link
// all trigger the correct email automatically — none of those files needed to change.
import { sendAppointmentEmail } from "./_lib/emailService.js";
import { formatAppointmentDate, formatAppointmentTime } from "./_lib/format.js";

function determineEmailType(record, oldRecord, eventType) {
  if (eventType === "INSERT") {
    // Only an admin/walk-in manual booking is created already-approved.
    // Public bookings insert as pending — no email at this stage.
    if (
      record.approval_status === "approved" &&
      record.appointment_status === "scheduled"
    ) {
      return "confirmation";
    }
    return null;
  }

  if (eventType === "UPDATE") {
    const wasCancelled = oldRecord?.appointment_status === "cancelled";
    const isCancelled = record.appointment_status === "cancelled";
    if (!wasCancelled && isCancelled) return "cancellation";

    if (isCancelled || record.appointment_status === "completed") return null;

    const wasApproved = oldRecord?.approval_status === "approved";
    const isApproved = record.approval_status === "approved";

    if (
      !wasApproved &&
      isApproved &&
      record.appointment_status === "scheduled"
    ) {
      return "confirmation";
    }

    const dateChanged = oldRecord?.confirmed_date !== record.confirmed_date;
    const timeChanged = oldRecord?.confirmed_time !== record.confirmed_time;

    if (wasApproved && isApproved && (dateChanged || timeChanged)) {
      return "reschedule";
    }
  }

  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.SUPABASE_WEBHOOK_SECRET;
  if (secret && req.headers["authorization"] !== `Bearer ${secret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { type, table, record, old_record } = req.body || {};

  if (table !== "appointments" || !record) {
    return res.status(200).json({ skipped: true, reason: "irrelevant_event" });
  }

  const emailType = determineEmailType(record, old_record, type);
  if (!emailType) {
    return res
      .status(200)
      .json({ skipped: true, reason: "no_matching_transition" });
  }

  const extra = {};
  if (emailType === "reschedule") {
    extra.previousDate = formatAppointmentDate(
      old_record?.confirmed_date ?? old_record?.preferred_date,
    );
    extra.previousTime = formatAppointmentTime(
      old_record?.confirmed_time ?? old_record?.preferred_time,
    );
  }

  try {
    const result = await sendAppointmentEmail({
      appointmentId: record.id,
      emailType,
      extra,
    });
    // Always 200: prevents Supabase from retrying a webhook that already logged its own failure.
    return res.status(200).json({ success: true, emailType, result });
  } catch (err) {
    console.error("Webhook email handling error:", err);
    return res.status(200).json({ success: false, error: err.message });
  }
}
