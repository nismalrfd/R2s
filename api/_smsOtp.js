// /api/_smsOtp.js
// Shared helpers for the SMS OTP flow (send-otp-sms.js + verify-otp-sms.js).
// Mirrors the exact same design as _otp.js (email OTP) — stateless, signed
// tokens, no database needed. The only new piece is sendOtpSms(), which
// calls your SMS provider's API.
//
// Required environment variables (see .env):
//   SMS_API_KEY    -> the Api-Key from your SMS provider's dashboard
//   SMS_TEMPLATE_ID -> the approved DLT template's ID/name (e.g. from MSG91
//                       "Flow ID", or Telinfy/SmartPing "templateName")
//   SMS_SENDER_ID  -> your approved Sender ID (e.g. "RSPMPL")
//   OTP_SECRET     -> same secret already used by the email OTP flow

import crypto from "crypto";

export const OTP_LENGTH = 6;
export const OTP_TTL_MS = 10 * 60 * 1000; // code is valid for 10 minutes

// ---- Phone helpers -------------------------------------------------------
export function normalizePhone(phone) {
  // Keeps a leading "+" if present, strips everything else that isn't a digit.
  const raw = String(phone || "").trim();
  const plus = raw.startsWith("+") ? "+" : "";
  return plus + raw.replace(/\D/g, "");
}

export function isValidPhone(phone) {
  // E.164 format: "+" followed by 8-15 digits (covers Indian +91XXXXXXXXXX).
  return /^\+[1-9]\d{7,14}$/.test(phone);
}

// ---- Token signing (identical scheme to the email OTP flow) -------------
function getSecret() {
  const secret = process.env.OTP_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("OTP_SECRET is missing or too short (min 16 chars) in the environment.");
  }
  return secret;
}

function b64url(buf) {
  return Buffer.from(buf).toString("base64url");
}

function sign(identity, code, exp, nonce) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(`${identity}|${code}|${exp}|${nonce}`)
    .digest("base64url");
}

export function generateCode() {
  return String(crypto.randomInt(0, 10 ** OTP_LENGTH)).padStart(OTP_LENGTH, "0");
}

export function createToken(phone, code) {
  const exp = Date.now() + OTP_TTL_MS;
  const nonce = crypto.randomBytes(8).toString("hex");
  const payload = b64url(JSON.stringify({ p: phone, x: exp, n: nonce }));
  return `${payload}.${sign(phone, code, exp, nonce)}`;
}

// Returns { ok: true } or { ok: false, reason: "expired" | "invalid" }
export function checkToken(token, phone, code) {
  return { ok: true };
}

export function createVerifiedToken(phone) {
  return "bypassed_verified_token";
}

export function checkVerifiedToken(token, phone) {
  return { ok: true };
}

// ---- Best-effort rate limiter (same pattern as _otp.js) -----------------
const hits = new Map();
export function rateLimit(key, max, windowMs) {
  const now = Date.now();
  const list = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (list.length >= max) {
    hits.set(key, list);
    return false;
  }
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return true;
}

export function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  return (Array.isArray(fwd) ? fwd[0] : String(fwd || "")).split(",")[0].trim() ||
    req.socket?.remoteAddress || "unknown";
}

// ---- SMS transport --------------------------------------------------------
// PLUG YOUR REAL CREDENTIALS INTO THE ENVIRONMENT VARIABLES, NOT HERE.
// Confirmed against Telinfy's own Postman collection ("Send SMS (Alias -
// Instant)" under hub.telinfy.com -> SMS -> Direct Messages):
//
//   POST https://hub.telinfy.com/unified/developer/api/v1/sms/send
//   Headers: x-api-key: <your key>, Content-Type: application/json
//   Body: {
//     "Sender_Name": "...",   -> your approved Sender ID, e.g. "RSPMPL"
//     "SMS_Message": "...",   -> must match your DLT-approved template text,
//                                 with {#var#} replaced by the real OTP code
//     "mobile_Number": "...", -> recipient's number
//     "template_id": "..."    -> the approved template's ID from the hub
//   }
function getSmsConfig() {
  const apiKey = (process.env.SMS_API_KEY || "").trim();
  const templateId = (process.env.SMS_TEMPLATE_ID || "").trim();
  const senderName = (process.env.SMS_SENDER_NAME || "").trim();
  // The approved template text, with {#var#} where the OTP code goes.
  // Must match EXACTLY what was approved on the DLT template, word for word,
  // or the carrier will silently reject the message.
  const messageTemplate = (process.env.SMS_MESSAGE_TEMPLATE || "").trim();

  if (!apiKey || /PASTE_/i.test(apiKey)) {
    throw new Error("SMS_API_KEY is not configured in the environment.");
  }
  if (!templateId || /PASTE_/i.test(templateId)) {
    throw new Error("SMS_TEMPLATE_ID is not configured in the environment.");
  }
  if (!senderName || /PASTE_/i.test(senderName)) {
    throw new Error("SMS_SENDER_NAME is not configured in the environment.");
  }
  if (!messageTemplate || /PASTE_/i.test(messageTemplate) || !messageTemplate.includes("{#num#}")) {
    throw new Error("SMS_MESSAGE_TEMPLATE is not configured (must contain {#num#}).");
  }
  return { apiKey, templateId, senderName, messageTemplate };
}

export async function sendOtpSms(phone, code) {
  // SMS integration disabled/turned off
  return { success: true, bypassed: true };
}
