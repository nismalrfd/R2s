// /api/send-otp.js
// OTP Email integration disabled/bypassed

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }
  return res.status(200).json({ success: true, token: "bypassed_token" });
}
