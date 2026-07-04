/* global process */
import { createClient } from "@supabase/supabase-js";
import { triggerCancellation } from "../src/services/trigger"; // <-- NEW

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY,
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Missing token" });
  }

  try {
    const { data: tokenData, error: tokenError } = await supabase
      .from("appointment_tokens")
      .select("*, appointment:appointments(*)")
      .eq("token", token)
      .eq("purpose", "cancellation")
      .single();

    if (tokenError || !tokenData) {
      return res.status(404).json({ error: "Invalid token" });
    }

    const now = new Date();
    const expiresAt = new Date(tokenData.expires_at);
    if (expiresAt < now) {
      return res
        .status(410)
        .json({ error: "This cancellation link has expired." });
    }

    if (!tokenData.is_active) {
      return res
        .status(410)
        .json({ error: "This link has already been used." });
    }

    const apt = tokenData.appointment;
    if (apt.appointment_status === "cancelled") {
      return res.status(410).json({ error: "Appointment already cancelled." });
    }
    if (apt.appointment_status === "completed") {
      return res
        .status(410)
        .json({ error: "Cannot cancel a completed appointment." });
    }

    const { error: updateError } = await supabase
      .from("appointments")
      .update({
        appointment_status: "cancelled",
        cancelled_at: now.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq("id", apt.id);

    if (updateError) {
      console.error("Update appointment error:", updateError);
      return res.status(500).json({ error: "Failed to cancel appointment." });
    }

    await supabase
      .from("appointment_tokens")
      .update({ is_active: false, used_at: now.toISOString() })
      .eq("id", tokenData.id);

    await supabase.from("appointment_logs").insert({
      appointment_id: apt.id,
      action: "cancelled_by_patient",
      description: "Appointment cancelled by patient via email link",
      performed_by: "system",
      admin_id: null,
      status: "cancelled",
    });

    // ── Trigger cancellation event to cancel pending reminders ──
    await triggerCancellation(apt.id).catch((err) => {
      console.error("Failed to trigger cancellation event:", err);
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Cancel appointment error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
