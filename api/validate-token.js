/* global process */
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY,
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ error: "Missing token" });
  }

  try {
    const { data: tokenData, error: tokenError } = await supabase
      .from("appointment_tokens")
      .select(
        "*, appointment:appointments(*, patient:patients(*), service_branch:service_branches(*, branch:branches(*), service:services(*)))",
      )
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
      return res
        .status(410)
        .json({ error: "This appointment has already been cancelled." });
    }
    if (apt.appointment_status === "completed") {
      return res
        .status(410)
        .json({ error: "This appointment has already been completed." });
    }

    return res.status(200).json({
      id: apt.id,
      patientName: `${apt.patient.first_name} ${apt.patient.last_name}`.trim(),
      date: new Date(apt.preferred_date).toLocaleDateString("en-PH", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: new Date(`1970-01-01T${apt.preferred_time}`).toLocaleTimeString(
        "en-PH",
        {
          hour: "2-digit",
          minute: "2-digit",
        },
      ),
      branch: apt.service_branch?.branch?.name || "Our Clinic",
      service:
        apt.snapshot_service_name ||
        apt.service_branch?.service?.name ||
        "Dental Service",
    });
  } catch (err) {
    console.error("Validate token error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
