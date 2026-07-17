// api/_lib/mailer.js
/* global process */
import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "Gmail credentials missing. Set GMAIL_USER and GMAIL_APP_PASSWORD.",
    );
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  return transporter;
}

export async function sendMail({ to, subject, html }) {
  const transport = getTransporter();
  const from = process.env.GMAIL_FROM_NAME
    ? `"${process.env.GMAIL_FROM_NAME}" <${process.env.GMAIL_USER}>`
    : process.env.GMAIL_USER;

  const info = await transport.sendMail({ from, to, subject, html });
  return { messageId: info.messageId };
}
