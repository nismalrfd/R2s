// /api/_propertyMail.js
// E-mail sent to a property's owner once the property has been approved.
// Uses the same Gmail SMTP account / env vars as the OTP e-mails (see _otp.js).

import nodemailer from "nodemailer";
import { getMailerConfig } from "./_otp.js";

function esc(v) {
  return String(v ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

export async function sendPropertyApprovedEmail({ to, ownerName, propertyName, propertyCode, location, propertyLink }) {
  const cfg = getMailerConfig();
  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.port === 465,
    auth: { user: cfg.user, pass: cfg.pass },
  });

  const greeting = ownerName ? `Hi ${ownerName},` : "Hello,";
  const details = [
    ["Property", propertyName],
    ["Property ID", propertyCode],
    ["Location", location],
  ].filter(([, v]) => v);

  const text =
    `${greeting}\n\n` +
    `Good news! Your property "${propertyName}" has been reviewed and approved by R2s Realtors.\n\n` +
    details.map(([k, v]) => `${k}: ${v}`).join("\n") +
    (propertyLink ? `\n\nView your listing: ${propertyLink}` : "") +
    `\n\nYou can log in to your R2s Realtors dashboard any time to track its status.\n` +
    `As promised, we will not share your property data without your permission.\n\n` +
    `Thank you,\nR2s Realtors`;

  const rows = details
    .map(([k, v]) =>
      `<tr><td style="padding:6px 12px 6px 0;color:#64748b;font-size:13px;">${esc(k)}</td>` +
      `<td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${esc(v)}</td></tr>`)
    .join("");

  const button = propertyLink && /^https?:\/\//i.test(propertyLink)
    ? `<p style="margin:24px 0 0;"><a href="${esc(propertyLink)}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 24px;border-radius:10px;">View your listing</a></p>`
    : "";

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f8fafc;padding:32px 16px;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:32px;">
      <h2 style="margin:0 0 4px;color:#0f172a;font-size:20px;">R2s Realtors</h2>
      <p style="margin:0 0 20px;color:#16a34a;font-size:14px;font-weight:700;">&#10003; Your property has been approved</p>
      <p style="margin:0 0 16px;color:#334155;font-size:14px;line-height:1.6;">${esc(greeting)}<br>Good news! Your property <strong>${esc(propertyName)}</strong> has been reviewed and approved by R2s Realtors.</p>
      <table role="presentation" style="border-collapse:collapse;margin:0 0 4px;">${rows}</table>
      ${button}
      <p style="margin:24px 0 0;color:#64748b;font-size:13px;line-height:1.6;">You can log in to your R2s Realtors dashboard any time to track its status. We will not share your property data without your permission.</p>
    </div>
  </div>`;

  await transporter.sendMail({
    from: cfg.from,
    to,
    subject: `Your property "${propertyName}" has been approved – R2s Realtors`,
    text,
    html,
  });
}
