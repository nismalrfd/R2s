// /api/get-property-detail.js
//
// Fetches a single property record (plus all its attached images) from
// Zoho CRM, for the property-detail page.
//
// Usage: /api/get-property-detail?id=XXXXXXXXX

import { getAccessToken, safeReadJson } from "./_zohoAuth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ success: false, error: "Missing id query parameter" });
    }

    const accessToken = await getAccessToken();

    const recordRes = await fetch(
      `${process.env.ZOHO_API_DOMAIN}/crm/v2/Products/${id}`,
      { headers: { Authorization: `Zoho-oauthtoken ${accessToken}` } }
    );
    const { json: recordData, rawText } = await safeReadJson(recordRes);
    console.log("GET PROPERTY DETAIL RESPONSE:", recordRes.status, rawText);

    const rec = recordData?.data?.[0];
    if (!rec) {
      return res.status(404).json({ success: false, error: "Property not found" });
    }

    // Fetch every attached image for the gallery (not just the first one)
    let images = [];
    try {
      const attachRes = await fetch(
        `${process.env.ZOHO_API_DOMAIN}/crm/v2/Products/${id}/Attachments`,
        { headers: { Authorization: `Zoho-oauthtoken ${accessToken}` } }
      );
      const { json: attachData } = await safeReadJson(attachRes);
      images = (attachData?.data || []).map(
        (a) => `/api/property-image?module=Products&recordId=${id}&attachmentId=${a.id}`
      );
    } catch (e) {
      // No attachments or lookup failed — that's fine, just show none.
    }

    return res.status(200).json({
      success: true,
      property: {
        id: rec.id,
        name: rec.Product_Name,
        kind: rec.Property_Kind,
        status: rec.Property_Status,
        price: rec.Amount,
        unit: rec.Property_Unit,
        floors: rec.Total_Floor,
        bedrooms: rec.Bedrooms,
        bathrooms: rec.Bathrooms,
        description: rec.Description,
        serviceType: rec.Property_Service_Type,
        date: rec.Created_Time ? rec.Created_Time.split("T")[0] : "",
        images,
      },
    });
  } catch (err) {
    console.error("get-property-detail error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}