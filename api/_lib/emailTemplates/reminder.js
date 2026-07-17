// api/_lib/emailTemplates/reminder.js
import { renderLayout } from "./layout.js";

const MESSAGE_MAP = {
  reminder_24h: "This is a reminder that your appointment is tomorrow.",
  reminder_2h: "This is a reminder that your appointment is in 2 hours.",
  reminder_30min: "Your appointment is in 30 minutes. Please arrive on time.",
};

const SUBJECT_MAP = {
  reminder_24h: "Reminder: Your Appointment is Tomorrow",
  reminder_2h: "Reminder: Your Appointment is in 2 Hours",
  reminder_30min: "Reminder: Your Appointment is in 30 Minutes",
};

export function buildReminderEmail({ clinic, appointment }) {
  const { patientName, date, time, branch, service, cancelLink, reminderType } =
    appointment;

  const bodyHtml = `
    <p class="greeting">Dear <strong>${patientName}</strong>,</p>
    <p>${MESSAGE_MAP[reminderType] || "This is a reminder of your upcoming appointment."}</p>
    <div class="appointment-card">
      <div class="row"><span class="label">Date</span><span class="value">${date}</span></div>
      <div class="row"><span class="label">Time</span><span class="value">${time}</span></div>
      <div class="row"><span class="label">Branch</span><span class="value">${branch}</span></div>
      <div class="row"><span class="label">Service</span><span class="value">${service}</span></div>
    </div>
    ${
      cancelLink
        ? `
    <p>If you need to cancel, please use the button below.</p>
    <div class="cta-wrapper">
      <a href="${cancelLink}" class="cta-button">Cancel Appointment</a>
    </div>`
        : ""
    }
  `;

  return {
    subject: SUBJECT_MAP[reminderType] || "Appointment Reminder",
    html: renderLayout({ clinic, title: "Appointment Reminder", bodyHtml }),
  };
}
