// api/_lib/emailService.js
/* global process */
// Single entry point for every transactional appointment email.
// Adding a new email type later = one template file + one line in TEMPLATE_BUILDERS.
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";
import { sendMail } from "./mailer.js";
import { formatAppointmentDate, formatAppointmentTime } from "./format.js";
import { buildConfirmationEmail } from "./emailTemplates/confirmation.js";
import { buildCancellationEmail } from "./emailTemplates/cancellation.js";
import { buildRescheduleEmail } from "./emailTemplates/reschedule.js";
import { buildReminderEmail } from "./emailTemplates/reminder.js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY,
);

const PUBLIC_APP_URL =
  process.env.PUBLIC_APP_URL || "https://leidibuddentals.vercel.app";

const TEMPLATE_BUILDERS = {
  confirmation: buildConfirmationEmail,
  cancellation: buildCancellationEmail,
  reschedule: buildRescheduleEmail,
  reminder: buildReminderEmail,
};

let clinicCache = null;
let clinicCacheAt = 0;
const CLINIC_CACHE_TTL_MS = 5 * 60 * 1000;

async function getClinicInfo() {
  const now = Date.now();
  if (clinicCache && now - clinicCacheAt < CLINIC_CACHE_TTL_MS)
    return clinicCache;

  const { data } = await supabase
    .from("clinic_settings")
    .select("clinic_name, logo_url, email, phone")
    .maybeSingle();

  clinicCache = {
    clinicName: data?.clinic_name || "Leidi Bud Dentals",
    logoUrl: data?.logo_url || null,
    email: data?.email || null,
    phone: data?.phone || null,
  };
  clinicCacheAt = now;
  return clinicCache;
}

async function fetchAppointment(appointmentId) {
  const { data, error } = await supabase
    .from("appointments")
    .select(
      `*, patient:patients(*), service_branch:service_branches(*, branch:branches(*), service:services(*))`,
    )
    .eq("id", appointmentId)
    .single();

  if (error) throw error;
  return data;
}

// ── Cancellation token: reuse an active one if it exists, otherwise create it. ──
async function getOrCreateCancellationToken(appointmentId) {
  const { data: existing } = await supabase
    .from("appointment_tokens")
    .select("token")
    .eq("appointment_id", appointmentId)
    .eq("purpose", "cancellation")
    .eq("is_active", true)
    .gte("expires_at", new Date().toISOString())
    .maybeSingle();

  if (existing?.token) return existing.token;

  const token = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  const { error } = await supabase.from("appointment_tokens").insert({
    appointment_id: appointmentId,
    token,
    purpose: "cancellation",
    expires_at: expiresAt.toISOString(),
    is_active: true,
  });

  if (error) {
    console.error("Failed to create cancellation token:", error);
    return null; // template will simply omit the button if this fails
  }

  return token;
}

function toEmailAppointment(row, extra) {
  const patient = row.patient;
  return {
    patientName:
      `${patient?.first_name ?? ""} ${patient?.last_name ?? ""}`.trim(),
    referenceNumber: row.reference_number,
    date: formatAppointmentDate(row.confirmed_date ?? row.preferred_date),
    time: formatAppointmentTime(row.confirmed_time ?? row.preferred_time),
    branch: row.service_branch?.branch?.name || "Our Clinic",
    service:
      row.snapshot_service_name ||
      row.service_branch?.service?.name ||
      "Dental Service",
    notes: row.admin_notes || row.chief_complaint || null,
    dentist: null, // no dentist column in current schema; wired for when one exists
    ...extra,
  };
}

/**
 * @param {string} appointmentId
 * @param {'confirmation'|'cancellation'|'reschedule'|'reminder'} emailType - which template to use
 * @param {object} extra - template-specific extras (previousDate/previousTime, cancelLink, reminderType)
 * @param {string} [logType] - value written to email_logs.email_type; defaults to emailType.
 *        Used by reminders to log the specific subtype (reminder_24h, etc.) for dedupe checks.
 * @param {string|null} [jobId]
 */
export async function sendAppointmentEmail({
  appointmentId,
  emailType,
  extra = {},
  logType,
  jobId = null,
}) {
  const buildTemplate = TEMPLATE_BUILDERS[emailType];
  if (!buildTemplate) {
    throw new Error(`Unknown email type: ${emailType}`);
  }

  const row = await fetchAppointment(appointmentId);
  const patient = row.patient;

  if (!patient?.email) {
    return { skipped: true, reason: "no_patient_email" };
  }

  const clinic = await getClinicInfo();

  // Attach a cancel link for confirmation/reschedule/reminder emails.
  // Reminders may already pass their own cancelLink via `extra` (built from
  // an existing token in send-reminders.js) — respect that if present.
  let cancelLink = extra.cancelLink || null;
  if (
    !cancelLink &&
    ["confirmation", "reschedule", "reminder"].includes(emailType)
  ) {
    const token = await getOrCreateCancellationToken(appointmentId);
    if (token)
      cancelLink = `${PUBLIC_APP_URL}/cancel-appointment?token=${token}`;
  }

  const appointment = toEmailAppointment(row, { ...extra, cancelLink });
  const { subject, html } = buildTemplate({ clinic, appointment });
  const type = logType || emailType;

  try {
    const { messageId } = await sendMail({ to: patient.email, subject, html });

    await supabase.from("email_logs").insert({
      appointment_id: appointmentId,
      recipient_email: patient.email,
      email_type: type,
      resend_message_id: messageId, // column name kept as-is; now stores the Gmail/nodemailer message id
      delivery_status: "sent",
      sent_at: new Date().toISOString(),
      job_id: jobId,
    });

    return { sent: true, messageId };
  } catch (err) {
    console.error(
      `Email send failed [${type}] for appointment ${appointmentId}:`,
      err,
    );

    await supabase.from("email_logs").insert({
      appointment_id: appointmentId,
      recipient_email: patient.email,
      email_type: type,
      delivery_status: "failed",
      error_message: err.message,
      job_id: jobId,
    });

    // Never throw — the booking/status change must never be rolled back because of an email failure.
    return { sent: false, error: err.message };
  }
}
