// api/send-reminders.js
/*global process*/
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

// ── Helper: determine reminder type based on minutes until appointment ──
function getReminderType(diffMinutes) {
  if (diffMinutes >= 24 * 60 && diffMinutes < 25 * 60) return "reminder_24h";
  if (diffMinutes >= 2 * 60 && diffMinutes < 3 * 60) return "reminder_2h";
  if (diffMinutes >= 30 && diffMinutes < 45) return "reminder_30min";
  if (diffMinutes > 0 && diffMinutes < 30) return "reminder_30min";
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("🕐 Reminder check started");

  const now = new Date();
  const twoDaysLater = new Date(now);
  twoDaysLater.setDate(now.getDate() + 2);

  const { data: appointments, error } = await supabase
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
    .eq("approval_status", "approved")
    .eq("appointment_status", "scheduled")
    .gte("preferred_date", now.toISOString().split("T")[0])
    .lte("preferred_date", twoDaysLater.toISOString().split("T")[0]);

  if (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).json({ error: error.message });
  }

  let remindersSent = 0;

  for (const apt of appointments) {
    const aptDate = new Date(`${apt.preferred_date}T${apt.preferred_time}`);
    const diffMinutes = (aptDate.getTime() - now.getTime()) / (1000 * 60);

    const reminderType = getReminderType(diffMinutes);
    if (!reminderType) continue;

    // Check if already sent
    const { count } = await supabase
      .from("email_logs")
      .select("*", { count: "exact", head: true })
      .eq("appointment_id", apt.id)
      .eq("email_type", reminderType);

    if (count > 0) {
      console.log(`⏭️ ${reminderType} already sent for ${apt.id}`);
      continue;
    }

    const patient = apt.patient;
    if (!patient?.email) {
      console.log(`⚠️ No email for patient ${patient?.id}`);
      continue;
    }

    // Get cancellation token
    const { data: tokenData } = await supabase
      .from("appointment_tokens")
      .select("token")
      .eq("appointment_id", apt.id)
      .eq("purpose", "cancellation")
      .eq("is_active", true)
      .single();

    const token = tokenData?.token;
    if (!token) {
      console.error(`❌ No cancellation token for ${apt.id}`);
      continue;
    }

    const html = buildReminderEmail({
      patientName: `${patient.first_name} ${patient.last_name}`.trim(),
      appointmentDate: aptDate.toLocaleDateString("en-PH", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      appointmentTime: aptDate.toLocaleTimeString("en-PH", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      branch: apt.service_branch?.branch?.name || "Our Clinic",
      service:
        apt.snapshot_service_name ||
        apt.service_branch?.service?.name ||
        "Dental Service",
      cancelLink: `${PUBLIC_APP_URL}/cancel-appointment?token=${token}`,
      reminderType,
    });

    const subjectMap = {
      reminder_24h: "Reminder: Your Appointment is Tomorrow",
      reminder_2h: "Reminder: Your Appointment is in 2 Hours",
      reminder_30min: "Reminder: Your Appointment is in 30 Minutes",
    };

    const { data, error: emailError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: patient.email,
      subject: subjectMap[reminderType] || "Appointment Reminder",
      html,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      await supabase.from("email_logs").insert({
        appointment_id: apt.id,
        recipient_email: patient.email,
        email_type: reminderType,
        delivery_status: "failed",
        error_message: emailError.message,
      });
      continue;
    }

    await supabase.from("email_logs").insert({
      appointment_id: apt.id,
      recipient_email: patient.email,
      email_type: reminderType,
      delivery_status: "sent",
      resend_message_id: data?.id,
      sent_at: new Date().toISOString(),
    });

    remindersSent++;
    console.log(`✅ Sent ${reminderType} for ${apt.id}`);
  }

  console.log(`📬 Reminders sent: ${remindersSent}`);
  return res.status(200).json({ sent: remindersSent });
}

function buildReminderEmail({
  patientName,
  appointmentDate,
  appointmentTime,
  branch,
  service,
  cancelLink,
  reminderType,
}) {
  const messageMap = {
    reminder_24h: "This is a reminder that your appointment is tomorrow.",
    reminder_2h: "This is a reminder that your appointment is in 2 hours.",
    reminder_30min: "Your appointment is in 30 minutes. Please arrive on time.",
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
      <p>${messageMap[reminderType] || "This is a reminder of your upcoming appointment."}</p>
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
