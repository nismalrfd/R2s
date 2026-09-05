// /api/get-locations.js
//
// Fetches every record from Zoho CRM's Locations module, for populating
// the "Location" dropdown when adding a property.

import { getAccessToken, safeReadJson } from "./_zohoAuth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const accessToken = await getAccessToken();

    // NOTE: assuming the module's API name is "Locations" — matching the
    // naming pattern of every other module we've mapped so far (Products,
    // Sellers, etc). If this returns a MODULE_NOT_FOUND-style error, the
    // real API name is different — check Zoho Setup > Modules for it.
    const zohoUrl = `${process.env.ZOHO_API_DOMAIN}/crm/v2/Locations?fields=Name,District,Street&per_page=200`;
    console.log("FETCHING LOCATIONS FROM:", zohoUrl);

    const zohoRes = await fetch(zohoUrl, {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
    });

    const { json: zohoData, rawText } = await safeReadJson(zohoRes);
    console.log("GET LOCATIONS RESPONSE:", zohoRes.status, rawText);

    if (zohoRes.status === 204 || !zohoData?.data) {
      return res.status(200).json({ success: true, locations: [] });
    }

    const locations = zohoData.data.map((rec) => ({
      id: rec.id,
      name: rec.Name,
      district: rec.District,
      street: rec.Street,
    }));

    return res.status(200).json({ success: true, locations });
  } catch (err) {
    console.error("get-locations error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}