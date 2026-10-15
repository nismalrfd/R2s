// /api/get-properties.js
//
// Fetches this person's actual properties directly from Zoho CRM's
// Products module, filtered by the Lookup field that matches their role
// (Seller for Owner, Agent_Modules for Agent, etc.) — so the dashboard
// always reflects real CRM data instead of relying on local browser storage.

import { getAccessToken, safeReadJson } from "./_zohoAuth.js";
import { PRODUCT_ROLE_LOOKUP_FIELD, isImageAttachment } from "./_zohoConfig.js";

const ROLE_LOOKUP_FIELD = PRODUCT_ROLE_LOOKUP_FIELD;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { role, recordId } = req.query;

    if (!role || !recordId) {
      return res.status(400).json({
        success: false,
        error: "Missing role or recordId query parameter",
      });
    }

    const lookupField = ROLE_LOOKUP_FIELD[role];
    if (!lookupField) {
      return res.status(400).json({ success: false, error: `Unknown role "${role}"` });
    }

    const accessToken = await getAccessToken();

    const criteria = encodeURIComponent(`(${lookupField}:equals:${recordId})`);
    const zohoUrl = `${process.env.ZOHO_API_DOMAIN}/crm/v2/Products/search?criteria=${criteria}`;
    console.log("FETCHING PROPERTIES FROM:", zohoUrl);

    const zohoRes = await fetch(zohoUrl, {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
    });

    const { json: zohoData, rawText } = await safeReadJson(zohoRes);
    console.log("GET PROPERTIES RESPONSE:", zohoRes.status, rawText);

    // Zoho returns 204 No Content when a search matches nothing at all
    if (zohoRes.status === 204 || !zohoData) {
      return res.status(200).json({ success: true, properties: [] });
    }

    // Zoho answers "INVALID_QUERY / Invalid query formed" when the field we
    // filter on can't be searched — in practice: the Lookup field name for
    // this role doesn't match the real API name on the Products module (see
    // _zohoConfig.js). That's a CRM setup problem, not something the person
    // using the dashboard did wrong, and the property they just saved is
    // still safely in CRM — so don't turn it into a failed request (which
    // shows up as a red 400 in the browser). Return an empty list plus a
    // warning, and leave a clear explanation in the server log.
    if (zohoData.code === "INVALID_QUERY" || /invalid query/i.test(zohoData.message || "")) {
      console.warn(
        `[get-properties] Zoho rejected the search on Products field "${lookupField}" ` +
          `(role "${role}"): ${zohoData.message}. Check that "${lookupField}" is the API name of ` +
          `a single-value Lookup field on the Products module (Zoho CRM > Setup > Modules and Fields > Products).`
      );
      return res.status(200).json({
        success: true,
        properties: [],
        warning: `CRM could not search Products by "${lookupField}" (${zohoData.message}).`,
      });
    }

    if (!zohoData.data) {
      return res.status(400).json({
        success: false,
        error: zohoData?.message || "Zoho search failed",
        zohoResponse: zohoData,
      });
    }

    // Map Zoho's field names back to the simple shape the dashboard expects.
    // Also look up each record's first attachment, so we can show the
    // real uploaded photo instead of a generic stock image.
    const properties = await Promise.all(
      zohoData.data.map(async (rec) => {
        let imageProxyUrl = null;
        try {
          const attachRes = await fetch(
            `${process.env.ZOHO_API_DOMAIN}/crm/v2/Products/${rec.id}/Attachments`,
            { headers: { Authorization: `Zoho-oauthtoken ${accessToken}` } }
          );
          const { json: attachData } = await safeReadJson(attachRes);
          const firstAttachment = (attachData?.data || []).find(isImageAttachment);
          if (firstAttachment) {
            imageProxyUrl = `/api/property-image?module=Products&recordId=${rec.id}&attachmentId=${firstAttachment.id}`;
          }
        } catch (e) {
          // If the attachment lookup fails, just fall back to no image —
          // don't let this block the property list itself from loading.
        }

        return {
          id: rec.id,
          name: rec.Product_Name,
          kind: rec.Property_Kind,
          status: rec.Property_Status,
          price: rec.Amount,
          unit: rec.Property_Unit,
          floors: rec.Total_Floor,
          date: rec.Created_Time ? rec.Created_Time.split("T")[0] : "",
          image: imageProxyUrl,
          propertyLink: rec.Property_Link || null,
          propertyCode: rec.Product_Code || null,
          // Location is a Lookup field, so Zoho returns { id, name } —
          // pull the display name back out for the dashboard card.
          location: rec.Location?.name || null,
        };
      })
    );

    return res.status(200).json({ success: true, properties });
  } catch (err) {
    console.error("get-properties error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}