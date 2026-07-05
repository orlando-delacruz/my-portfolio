// src/components/ui/Email/ConfirmationEmail.jsx
export function renderConfirmationEmail({
  patientName,
  referenceNumber,
  date,
  time,
  branch,
  service,
  status,
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmation</title>
  <style>
    body { margin:0; padding:0; font-family: 'Inter', Arial, sans-serif; background: #f6f6f6; }
    .container { max-width: 600px; margin:0 auto; background: #ffffff; padding: 30px 20px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #886217; }
    .logo { max-width: 120px; }
    .clinic-name { font-size: 28px; font-weight: 600; color: #886217; margin: 8px 0 0; }
    .content { padding: 24px 0; }
    .greeting { font-size: 18px; color: #222; }
    .appointment-card { background: #f8f7f3; border-radius: 12px; padding: 20px; margin: 16px 0; }
    .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e0d5c0; }
    .row:last-child { border-bottom: none; }
    .label { color: #555; font-weight: 500; }
    .value { color: #222; font-weight: 600; }
    .status-badge { display: inline-block; background: #886217; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 14px; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e0d5c0; font-size: 12px; color: #888; text-align: center; }
    .footer a { color: #886217; text-decoration: none; }
    @media (max-width: 480px) {
      .container { padding: 20px 16px; }
      .row { flex-direction: column; gap: 2px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://your-clinic-domain.com/logo.png" alt="Leidi Bud Dentals" class="logo" />
      <h1 class="clinic-name">Leidi Bud Dentals</h1>
    </div>
    <div class="content">
      <p class="greeting">Dear <strong>${patientName}</strong>,</p>
      <p>Your appointment has been successfully booked. Please find the details below:</p>
      <div class="appointment-card">
        <div class="row"><span class="label">Reference</span><span class="value">${referenceNumber}</span></div>
        <div class="row"><span class="label">Date</span><span class="value">${date}</span></div>
        <div class="row"><span class="label">Time</span><span class="value">${time}</span></div>
        <div class="row"><span class="label">Branch</span><span class="value">${branch}</span></div>
        <div class="row"><span class="label">Service</span><span class="value">${service}</span></div>
        <div class="row"><span class="label">Status</span><span class="value"><span class="status-badge">${status}</span></span></div>
      </div>
      <p>We look forward to seeing you soon!</p>
      <p style="font-size:14px; color:#888;">If you need to cancel or reschedule, please contact us at <a href="tel:+639123456789">+63 912 345 6789</a>.</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Leidi Bud Dentals. All rights reserved.<br/>
      Rosario, Batangas, Philippines
    </div>
  </div>
</body>
</html>
  `;
}