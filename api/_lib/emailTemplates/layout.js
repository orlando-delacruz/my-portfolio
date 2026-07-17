// api/_lib/emailTemplates/layout.js
export function renderLayout({ clinic, title, bodyHtml, footerNote }) {
  const { clinicName, logoUrl, email, phone } = clinic;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
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
    .cta-button { display: inline-block; background: #886217; color: #fff !important; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: 600; margin: 20px 0 10px; }
    .cta-wrapper { text-align: center; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e0d5c0; font-size: 12px; color: #888; text-align: center; }
    .footer a { color: #886217; text-decoration: none; }
    @media (max-width: 480px) {
      .container { padding: 20px 16px; }
      .row { flex-direction: column; gap: 2px; }
      .cta-button { display: block; text-align: center; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      ${logoUrl ? `<img src="${logoUrl}" alt="${clinicName}" class="logo" />` : ""}
      <h1 class="clinic-name">${clinicName}</h1>
    </div>
    <div class="content">
      ${bodyHtml}
      ${footerNote ? `<p style="font-size:14px; color:#888;">${footerNote}</p>` : ""}
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} ${clinicName}. All rights reserved.<br/>
      ${phone ? `<a href="tel:${phone}">${phone}</a>` : ""} ${email ? `&nbsp;•&nbsp;<a href="mailto:${email}">${email}</a>` : ""}
    </div>
  </div>
</body>
</html>`;
}
