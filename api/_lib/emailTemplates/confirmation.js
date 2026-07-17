// api/_lib/emailTemplates/confirmation.js
import { renderLayout } from "./layout.js";

export function buildConfirmationEmail({ clinic, appointment }) {
  const {
    patientName,
    referenceNumber,
    date,
    time,
    branch,
    service,
    dentist,
    notes,
  } = appointment;

  const bodyHtml = `
    <p class="greeting">Dear <strong>${patientName}</strong>,</p>
    <p>Your appointment has been successfully confirmed. Please find the details below:</p>
    <div class="appointment-card">
      <div class="row"><span class="label">Reference</span><span class="value">${referenceNumber}</span></div>
      <div class="row"><span class="label">Date</span><span class="value">${date}</span></div>
      <div class="row"><span class="label">Time</span><span class="value">${time}</span></div>
      <div class="row"><span class="label">Branch</span><span class="value">${branch}</span></div>
      <div class="row"><span class="label">Service</span><span class="value">${service}</span></div>
      ${dentist ? `<div class="row"><span class="label">Dentist</span><span class="value">${dentist}</span></div>` : ""}
      ${notes ? `<div class="row"><span class="label">Notes</span><span class="value">${notes}</span></div>` : ""}
      <div class="row"><span class="label">Status</span><span class="value"><span class="status-badge">Confirmed</span></span></div>
    </div>
    <p>We look forward to seeing you soon!</p>
  `;

  return {
    subject: `Appointment Confirmed – ${clinic.clinicName}`,
    html: renderLayout({
      clinic,
      title: "Appointment Confirmation",
      bodyHtml,
      footerNote: `If you need to cancel or reschedule, please contact us${clinic.phone ? ` at <a href="tel:${clinic.phone}">${clinic.phone}</a>` : ""}.`,
    }),
  };
}
