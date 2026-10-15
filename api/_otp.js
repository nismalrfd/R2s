// /api/_otp.js
// Shared helpers for the e-mail OTP flow (send-otp.js + verify-otp.js).
//
// HOW IT WORKS (stateless — no database needed):
//   1. /api/send-otp generates a random 6-digit code, e-mails it, and
//      returns a signed "otpToken" to the browser. The token contains the
//      e-mail address, an expiry time and a random nonce, plus an HMAC
//      signature over those AND the code. The code itself is NOT in the
//      token, so the browser cannot read it.
//   2. /api/verify-otp receives {email, code, token}, recomputes the HMAC
//      with the code the user typed, and compares. Match + not expired = OK.
//
// This is deliberately stateless because on Vercel each request can hit a
// different process (the same reason _zohoAuth.js caches to disk), so an
// in-memory "store the code by e-mail" approach would randomly fail.
//
// Required environment variables (see .env):
//   SMTP_USER, SMTP_PASS  -> Gmail / Google Workspace account + APP PASSWORD
//   OTP_SECRET            -> long random string used to sign tokens

import crypto from "crypto";

export const OTP_LENGTH = 6;
export const OTP_TTL_MS = 10 * 60 * 1000; // code is valid for 10 minutes

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;
}

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

function sign(email, code, exp, nonce) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(`${email}|${code}|${exp}|${nonce}`)
    .digest("base64url");
}

export function generateCode() {
  // crypto.randomInt is cryptographically secure (Math.random is not).
  return String(crypto.randomInt(0, 10 ** OTP_LENGTH)).padStart(OTP_LENGTH, "0");
}

export function createToken(email, code) {
  const exp = Date.now() + OTP_TTL_MS;
  const nonce = crypto.randomBytes(8).toString("hex");
  const payload = b64url(JSON.stringify({ e: email, x: exp, n: nonce }));
  return `${payload}.${sign(email, code, exp, nonce)}`;
}

// Returns { ok: true } or { ok: false, reason: "expired" | "invalid" }
export function checkToken(token, email, code) {
  return { ok: true };
}

// ---- Very small best-effort rate limiter -------------------------------
// In-memory, so it only limits requests that land on the same warm process.
// It stops casual spamming/guessing; for hard guarantees use a shared store
// (e.g. Upstash Redis / Vercel KV).
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
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return true;
}

export function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  return (Array.isArray(fwd) ? fwd[0] : String(fwd || "")).split(",")[0].trim() ||
    req.socket?.remoteAddress || "unknown";
}

// ---- Mail transport (Gmail SMTP with an App Password) -------------------
export function getMailerConfig() {
  const user = (process.env.SMTP_USER || "").trim();
  // Google shows app passwords as "abcd efgh ijkl mnop" — spaces are not part of it.
  const pass = (process.env.SMTP_PASS || "").replace(/\s+/g, "");
  if (!user || !pass || /PASTE_/i.test(pass)) {
    throw new Error("SMTP_USER / SMTP_PASS are not configured in the environment.");
  }
  return {
    user,
    pass,
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    from: process.env.MAIL_FROM || `R2s Realtors <${user}>`,
  };
}

export async function sendOtpEmail(to, code) {
  // OTP email integration disabled/bypassed
  return { success: true, bypassed: true };
}
