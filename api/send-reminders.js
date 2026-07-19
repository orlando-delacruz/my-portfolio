// api/send-reminders.js
/*global process*/
import { createClient } from "@supabase/supabase-js";
import { sendAppointmentEmail } from "./_lib/emailService.js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY,
);

const PUBLIC_APP_URL =
  process.env.PUBLIC_APP_URL || "https://leidibuddentals.vercel.app";

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

  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers["authorization"] !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  console.log("🕐 Reminder check started");

  const now = new Date();
  const twoDaysLater = new Date(now);
  twoDaysLater.setDate(now.getDate() + 2);

  const { data: appointments, error } = await supabase
    .from("appointments")
    .select(
      `*, patient:patients(*), service_branch:service_branches(*, branch:branches(*), service:services(*))`,
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

    const { count } = await supabase
      .from("email_logs")
      .select("*", { count: "exact", head: true })
      .eq("appointment_id", apt.id)
      .eq("email_type", reminderType);

    if (count > 0) {
      console.log(`⏭️ ${reminderType} already sent for ${apt.id}`);
      continue;
    }

    if (!apt.patient?.email) {
      console.log(`⚠️ No email for patient ${apt.patient?.id}`);
      continue;
    }

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

    const result = await sendAppointmentEmail({
      appointmentId: apt.id,
      emailType: "reminder",
      logType: reminderType, // logged as reminder_24h / reminder_2h / reminder_30min for dedupe above
      extra: {
        cancelLink: `${PUBLIC_APP_URL}/cancel-appointment?token=${token}`,
        reminderType,
      },
    });

    if (result.sent) {
      remindersSent++;
      console.log(`✅ Sent ${reminderType} for ${apt.id}`);
    }
  }

  console.log(`📬 Reminders sent: ${remindersSent}`);
  return res.status(200).json({ sent: remindersSent });
}
