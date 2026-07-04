// api/send-confirmation.js
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.REMINDER_FROM_EMAIL || "onboarding@resend.dev";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { appointmentId } = req.body;
  if (!appointmentId) {
    return res.status(400).json({ error: "Missing appointmentId" });
  }

  try {
    const { data: appointment, error } = await supabase
      .from("appointments")
      .select(
        `
        *,
        patient:patients(*)
      `,
      ) // simplified select, include only patient relation
      .eq("id", appointmentId)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res
        .status(500)
        .json({ error: `Supabase error: ${error.message}` });
    }

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Log the entire appointment to see what we got
    console.log("Appointment data:", JSON.stringify(appointment, null, 2));

    const patient = appointment.patient;
    if (!patient || !patient.email) {
      console.log(
        `Patient email missing. Patient object: ${JSON.stringify(patient)}`,
      );
      return res.status(200).json({ message: "No email address provided" });
    }

    // ... rest of the email sending code (same as before) ...
  } catch (err) {
    console.error("Confirmation error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
