// /api/check-user.js
// POST { phone } -> checks whether the mobile number belongs to a registered R2S user.
// Login remains OTP based; this endpoint only prevents unregistered numbers from entering the OTP flow.
import { normalizePhone, isValidPhone } from "./_smsOtp.js";
import { getAccessToken } from "./_zohoAuth.js";

const USERS = [
  { role: "owner", module: "Sellers", fields: ["Phone"] },
  { role: "nar", module: "NAR_Realtors", fields: ["Phone"] },
  { role: "partner", module: "Channel_Partners", fields: ["Phone"] },
  { role: "builder", module: "Builder_Modules", fields: ["Primary_Contact_Number", "Phone"] },
  { role: "agent", module: "Agent_Modules", fields: ["Phone"] },
  { role: "nri", module: "NRI", fields: ["Phone_1"] },
];

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" });

  try {
    const phone = normalizePhone(req.body?.phone);
    if (!isValidPhone(phone)) return res.status(400).json({ success: false, error: "Please enter a valid mobile number." });

    const token = await getAccessToken();

    for (const user of USERS) {
      for (const field of user.fields) {
        const criteria = `(${field}:equals:${phone})`;
        const url = `${process.env.ZOHO_API_DOMAIN}/crm/v2/${user.module}/search?criteria=${encodeURIComponent(criteria)}`;
        const r = await fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${token}` } });
        if (r.status === 204) continue;
        const data = await r.json().catch(() => ({}));
        if (r.ok && Array.isArray(data.data) && data.data.length) {
          const record = data.data[0];
          return res.status(200).json({
            success: true,
            registered: true,
            role: user.role,
            recordId: record.id,
            name: record.Name || record.Last_Name || "",
          });
        }
      }
    }

    return res.status(200).json({ success: true, registered: false });
  } catch (err) {
    console.error("check-user error:", err);
    return res.status(500).json({ success: false, error: "Could not verify the mobile number right now." });
  }
}
