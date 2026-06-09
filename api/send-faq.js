/* global process */
// api/send-faq.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, question } = req.body;

  if (!email || !question) {
    return res.status(400).json({ error: "Email and question are required" });
  }

  try {
    const { error } = await resend.emails.send({
      // removed 'data'
      from: "Leidi Bud Dentals <onboarding@resend.dev>",
      to: ["orlando.delacruz.dev@gmail.com"],
      subject: "New FAQ Question from Website",
      html: `
        <h2>New question from your website</h2>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Question:</strong></p>
        <p>${question.replace(/\n/g, "<br/>")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ error: "Failed to send email" });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
