// api/_lib/emailTemplates/cancellation.js
import { renderLayout } from "./layout.js";

export function buildCancellationEmail({ clinic, appointment }) {
  const { patientName, referenceNumber, date, time, branch, service } =
    appointment;

  const bodyHtml = `
    <p class="greeting">Dear <strong>${patientName}</strong>,</p>
    <p>This confirms that your appointment has been cancelled. Details of the cancelled appointment:</p>
    <div class="appointment-card">
      <div class="row"><span class="label">Reference</span><span class="value">${referenceNumber}</span></div>
      <div class="row"><span class="label">Date</span><span class="value">${date}</span></div>
      <div class="row"><span class="label">Time</span><span class="value">${time}</span></div>
      <div class="row"><span class="label">Branch</span><span class="value">${branch}</span></div>
      <div class="row"><span class="label">Service</span><span class="value">${service}</span></div>
      <div class="row"><span class="label">Status</span><span class="value"><span class="status-badge">Cancelled</span></span></div>
    </div>
    <p>If this was a mistake or you'd like to book a new appointment, we'd be happy to help.</p>
  `;

  return {
    subject: `Appointment Cancelled – ${clinic.clinicName}`,
    html: renderLayout({
      clinic,
      title: "Appointment Cancellation",
      bodyHtml,
      footerNote: `Questions? Contact us${clinic.phone ? ` at <a href="tel:${clinic.phone}">${clinic.phone}</a>` : ""}.`,
    }),
  };
}
