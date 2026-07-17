// api/send-confirmation.js
// Kept as a thin legacy/manual-trigger endpoint (e.g. for a future "resend email" admin
// action) — the normal path is now the webhook, which fires automatically.
import { sendAppointmentEmail } from "./_lib/emailService.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { appointmentId } = req.body || {};
  if (!appointmentId) {
    return res.status(400).json({ error: "Missing appointmentId" });
  }

  try {
    const result = await sendAppointmentEmail({
      appointmentId,
      emailType: "confirmation",
    });
    if (result.skipped) {
      return res.status(200).json({ message: "No email address provided" });
    }
    if (!result.sent) {
      return res.status(500).json({ error: result.error });
    }
    return res.status(200).json({ success: true, messageId: result.messageId });
  } catch (err) {
    console.error("Confirmation error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
