// /api/get-buyer-leads.js
//
// Returns Buyer Leads from the Zoho CRM Leads module,
// filtered by the logged-in user's CRM record.

import { getAccessToken, safeReadJson } from "./_zohoAuth.js";

// These are the actual Lookup fields in the CRM Leads module.
const BUYERLEAD_LOOKUP_FIELD = {
  nar: "NAR_Realtor",
  partner: "Channel_Partner",
  agent: "Agent",
};

// Mask phone number for display.
function maskPhoneNumber(number) {
  const digits = String(number || "").replace(/\D/g, "");

  if (digits.length < 6) {
    return "XXXXXXXXXX";
  }

  const head = digits.slice(0, digits.length - 8);
  const firstVisible = digits.slice(
    digits.length - 8,
    digits.length - 7
  );
  const last5 = digits.slice(-5);

  return `${head}${firstVisible}XXX${last5}`;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { role, recordId } = req.query;

    if (!role || !recordId) {
      return res.status(400).json({
        success: false,
        error: "Missing role or recordId query parameter",
      });
    }

    // Find the correct Lookup field based on logged-in user's role.
    const lookupField = BUYERLEAD_LOOKUP_FIELD[role];

    if (!lookupField) {
      return res.status(403).json({
        success: false,
        error: `Role "${role}" cannot view Buyer Leads`,
      });
    }

    const accessToken = await getAccessToken();

    // Search the actual Leads module.
    // Example for a Channel Partner:
    // Channel_Partner equals the logged-in Partner CRM record ID.
    const criteria = encodeURIComponent(
      `(${lookupField}:equals:${recordId})`
    );

    const zohoUrl =
      `${process.env.ZOHO_API_DOMAIN}/crm/v2/Leads/search?criteria=${criteria}`;

    console.log("GET BUYER LEADS");
    console.log("Role:", role);
    console.log("Record ID:", recordId);
    console.log("Lookup Field:", lookupField);
    console.log("Zoho Search URL:", zohoUrl);

    const zohoRes = await fetch(zohoUrl, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
    });

    const {
      json: zohoData,
      rawText,
    } = await safeReadJson(zohoRes);

    console.log(
      "GET LEADS RESPONSE STATUS:",
      zohoRes.status
    );

    console.log(
      "GET LEADS RESPONSE:",
      rawText
    );

    // Zoho can return 204 when no records are found.
    if (zohoRes.status === 204 || !zohoData) {
      return res.status(200).json({
        success: true,
        leads: [],
      });
    }

    if (!zohoData.data) {
      return res.status(400).json({
        success: false,
        error:
          zohoData?.message ||
          "Zoho search failed",
        zohoResponse: zohoData,
        raw: rawText,
      });
    }

    // Convert CRM Leads into the structure
    // already expected by the existing HTML.
    const leads = zohoData.data.map((rec) => ({
      id: rec.id,

      // CRM Leads:
      // Buyer Name → Last_Name
      buyerName: rec.Last_Name || "Unnamed Buyer",

      // CRM Leads:
      // Contact Number → Phone
      buyerContact: rec.Phone || "",

      buyerContactMasked: maskPhoneNumber(
        rec.Phone
      ),

      // CRM Leads:
      // Preferred Location → Preferred_Locations
      preferredLocation:
        rec.Preferred_Locations || "",

      createdAt: rec.Created_Time,
    }));

    return res.status(200).json({
      success: true,
      leads,
    });

  } catch (err) {
    console.error(
      "get-buyer-leads error:",
      err.message
    );

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}