// trigger/jobs/reminder.js
/*global process*/
import { job } from "@trigger.dev/sdk";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY,
);
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.REMINDER_FROM_EMAIL || "onboarding@resend.dev";
const PUBLIC_APP_URL =
  process.env.PUBLIC_APP_URL || "https://leidibuddentals.vercel.app";

export const reminderJob = job({
  id: "reminder-email",
  name: "Send reminder email",
  version: "1.0.0",
  trigger: "event",
  event: "reminder.due",
  run: async (payload) => {
    const { appointmentId, type } = payload;
    console.log(`📧 Sending ${type} reminder for ${appointmentId}`);

    // 1. Fetch appointment
    const { data: appointment, error } = await supabase
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

    if (error || !appointment) {
      console.error("Appointment not found:", error);
      throw new Error("Appointment not found");
    }

    // 2. Validate appointment is still valid
    if (appointment.appointment_status === "cancelled") {
      console.log(
        `Appointment ${appointmentId} is cancelled, skipping reminder`,
      );
      return { success: true, skipped: true };
    }
    if (appointment.appointment_status === "completed") {
      console.log(
        `Appointment ${appointmentId} is completed, skipping reminder`,
      );
      return { success: true, skipped: true };
    }
    if (appointment.approval_status !== "approved") {
      console.log(
        `Appointment ${appointmentId} is not approved, skipping reminder`,
      );
      return { success: true, skipped: true };
    }

    const patient = appointment.patient;
    if (!patient?.email) {
      console.log(`No email for patient, skipping`);
      return { success: true, skipped: true };
    }

    // 3. Check if reminder already sent
    const { count } = await supabase
      .from("email_logs")
      .select("*", { count: "exact", head: true })
      .eq("appointment_id", appointmentId)
      .eq("email_type", type);

    if (count > 0) {
      console.log(`${type} already sent for ${appointmentId}, skipping`);
      return { success: true, duplicate: true };
    }

    // 4. Get cancellation token
    const { data: tokenData } = await supabase
      .from("appointment_tokens")
      .select("token")
      .eq("appointment_id", appointmentId)
      .eq("purpose", "cancellation")
      .eq("is_active", true)
      .single();

    const token = tokenData?.token;
    if (!token) {
      console.error(
        "No cancellation token found for appointment",
        appointmentId,
      );
      return { success: false, error: "No token" };
    }

    // 5. Build reminder email
    const html = buildReminderEmail({
      patientName: `${patient.first_name} ${patient.last_name}`.trim(),
      appointmentDate: new Date(appointment.preferred_date).toLocaleDateString(
        "en-PH",
        {
          month: "long",
          day: "numeric",
          year: "numeric",
        },
      ),
      appointmentTime: new Date(
        `1970-01-01T${appointment.preferred_time}`,
      ).toLocaleTimeString("en-PH", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      branch: appointment.service_branch?.branch?.name || "Our Clinic",
      service:
        appointment.snapshot_service_name ||
        appointment.service_branch?.service?.name ||
        "Dental Service",
      cancelLink: `${PUBLIC_APP_URL}/cancel-appointment?token=${token}`,
      type,
    });

    // 6. Send email
    const subjectMap = {
      reminder_24h: "Reminder: Your Appointment is Tomorrow",
      reminder_2h: "Reminder: Your Appointment is in 2 Hours",
    };

    const { data, error: emailError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: patient.email,
      subject: subjectMap[type] || "Appointment Reminder",
      html,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      await logEmail(
        appointmentId,
        patient.email,
        type,
        "failed",
        null,
        emailError.message,
      );
      throw emailError;
    }

    await logEmail(appointmentId, patient.email, type, "sent", data?.id);
    console.log(`✅ ${type} reminder sent for ${appointmentId}`);

    return { success: true, messageId: data?.id };
  },
});

async function logEmail(
  appointmentId,
  recipient,
  emailType,
  status,
  messageId,
  errorMessage,
) {
  await supabase.from("email_logs").insert({
    appointment_id: appointmentId,
    recipient_email: recipient,
    email_type: emailType,
    delivery_status: status,
    resend_message_id: messageId,
    error_message: errorMessage || null,
    sent_at: status === "sent" ? new Date().toISOString() : null,
  });
}

function buildReminderEmail({
  patientName,
  appointmentDate,
  appointmentTime,
  branch,
  service,
  cancelLink,
  type,
}) {
  const messageMap = {
    reminder_24h: "This is a reminder that your appointment is tomorrow.",
    reminder_2h: "This is a reminder that your appointment is in 2 hours.",
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Reminder</title>
  <style>
    body { margin:0; padding:0; font-family: 'Inter', Arial, sans-serif; background: #f6f6f6; }
    .container { max-width: 600px; margin:0 auto; background: #ffffff; padding: 30px 20px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #886217; }
    .logo { max-width: 120px; }
    .clinic-name { font-size: 28px; font-weight: 600; color: #886217; margin: 8px 0 0; }
    .content { padding: 24px 0; }
    .greeting { font-size: 18px; color: #222; }
    .appointment-card { background: #f8f7f3; border-radius: 12px; padding: 20px; margin: 16px 0; }
    .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e0d5c0; }
    .row:last-child { border-bottom: none; }
    .label { color: #555; font-weight: 500; }
    .value { color: #222; font-weight: 600; }
    .cta-button { display: inline-block; background: #886217; color: #fff !important; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: 600; margin: 20px 0 10px; }
    .cta-wrapper { text-align: center; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e0d5c0; font-size: 12px; color: #888; text-align: center; }
    .footer a { color: #886217; text-decoration: none; }
    @media (max-width: 480px) {
      .container { padding: 20px 16px; }
      .row { flex-direction: column; gap: 2px; }
      .cta-button { display: block; text-align: center; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://your-clinic-domain.com/logo.png" alt="Leidi Bud Dentals" class="logo" />
      <h1 class="clinic-name">Leidi Bud Dentals</h1>
    </div>
    <div class="content">
      <p class="greeting">Dear <strong>${patientName}</strong>,</p>
      <p>${messageMap[type] || "This is a reminder of your upcoming appointment."}</p>
      <div class="appointment-card">
        <div class="row"><span class="label">Date</span><span class="value">${appointmentDate}</span></div>
        <div class="row"><span class="label">Time</span><span class="value">${appointmentTime}</span></div>
        <div class="row"><span class="label">Branch</span><span class="value">${branch}</span></div>
        <div class="row"><span class="label">Service</span><span class="value">${service}</span></div>
      </div>
      <p>If you need to cancel, please use the button below.</p>
      <div class="cta-wrapper">
        <a href="${cancelLink}" class="cta-button">Cancel Appointment</a>
      </div>
      <p style="font-size:14px; color:#888; margin-top:12px;">If you have any questions, contact us at <a href="tel:+639123456789">+63 912 345 6789</a>.</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Leidi Bud Dentals. All rights reserved.<br/>
      Rosario, Batangas, Philippines
    </div>
  </div>
</body>
</html>
  `;
}
