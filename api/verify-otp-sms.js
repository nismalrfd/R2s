// /api/verify-otp-sms.js
// OTP SMS integration disabled/bypassed

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }
  return res.status(200).json({ success: true, verifiedToken: "bypassed_verified_token" });
}
