// api/_lib/emailTemplates/reschedule.js
import { renderLayout } from "./layout.js";

export function buildRescheduleEmail({ clinic, appointment }) {
  const {
    patientName,
    referenceNumber,
    date,
    time,
    branch,
    service,
    dentist,
    notes,
    previousDate,
    previousTime,
  } = appointment;

  const bodyHtml = `
    <p class="greeting">Dear <strong>${patientName}</strong>,</p>
    <p>Your appointment has been rescheduled. Here are the updated details:</p>
    ${
      previousDate
        ? `
    <div class="appointment-card" style="opacity:0.7;">
      <div class="row"><span class="label">Previous Date</span><span class="value" style="text-decoration:line-through;">${previousDate}</span></div>
      ${previousTime ? `<div class="row"><span class="label">Previous Time</span><span class="value" style="text-decoration:line-through;">${previousTime}</span></div>` : ""}
    </div>`
        : ""
    }
    <div class="appointment-card">
      <div class="row"><span class="label">Reference</span><span class="value">${referenceNumber}</span></div>
      <div class="row"><span class="label">New Date</span><span class="value">${date}</span></div>
      <div class="row"><span class="label">New Time</span><span class="value">${time}</span></div>
      <div class="row"><span class="label">Branch</span><span class="value">${branch}</span></div>
      <div class="row"><span class="label">Service</span><span class="value">${service}</span></div>
      ${dentist ? `<div class="row"><span class="label">Dentist</span><span class="value">${dentist}</span></div>` : ""}
      ${notes ? `<div class="row"><span class="label">Notes</span><span class="value">${notes}</span></div>` : ""}
      <div class="row"><span class="label">Status</span><span class="value"><span class="status-badge">Confirmed</span></span></div>
    </div>
    <p>We look forward to seeing you at your new appointment time!</p>
  `;

  return {
    subject: `Appointment Rescheduled – ${clinic.clinicName}`,
    html: renderLayout({
      clinic,
      title: "Appointment Rescheduled",
      bodyHtml,
      footerNote: `If this new time doesn't work, please contact us${clinic.phone ? ` at <a href="tel:${clinic.phone}">${clinic.phone}</a>` : ""}.`,
    }),
  };
}
