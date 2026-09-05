// /api/check-admin.js
//
// Req. 10: Admin login reuses the existing OTP flow. Once the OTP is
// verified client-side, the frontend calls this endpoint with the
// verified mobile number. Authorization is decided ONLY here on the
// backend — the frontend must never be trusted to decide who is Admin.
//
// Configure the authorized Admin numbers via the ADMIN_MOBILE_NUMBERS
// environment variable as a comma-separated list of 10-digit numbers,
// e.g. ADMIN_MOBILE_NUMBERS=8111918852,9876543210
// If the env var isn't set, the example number from the requirements
// doc is used as a fallback so the flow is testable out of the box —
// replace/extend this via env vars before going live.

const DEFAULT_ADMIN_NUMBERS = ["8111918852"];

function normalize(number) {
  return String(number || "").replace(/\D/g, "").slice(-10);
}

function getAdminNumbers() {
  const fromEnv = process.env.ADMIN_MOBILE_NUMBERS;
  if (!fromEnv) return DEFAULT_ADMIN_NUMBERS;
  return fromEnv.split(",").map((n) => normalize(n)).filter(Boolean);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { mobile } = req.body || {};
    const normalized = normalize(mobile);

    if (!normalized || normalized.length !== 10) {
      return res.status(400).json({ success: false, error: "Invalid mobile number" });
    }

    const adminNumbers = getAdminNumbers();
    const isAdmin = adminNumbers.includes(normalized);

    return res.status(200).json({ success: true, isAdmin });
  } catch (err) {
    console.error("check-admin error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}
