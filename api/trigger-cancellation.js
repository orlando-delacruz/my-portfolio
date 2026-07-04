// api/trigger-cancellation.js
import { triggerCancellation } from "../src/services/trigger";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { appointmentId } = req.body;
  if (!appointmentId) {
    return res.status(400).json({ error: "Missing appointmentId" });
  }

  try {
    const result = await triggerCancellation(appointmentId);
    return res.status(200).json({ success: true, result });
  } catch (err) {
    console.error("Trigger error:", err);
    return res.status(500).json({ error: err.message });
  }
}
