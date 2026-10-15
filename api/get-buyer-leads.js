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
  nri: "NRI",
};

// Mask phone number for display: only the LAST 4 digits stay visible
// (9876543210 -> XXXXXX3210). Keep identical to window.maskPhoneNumber
// in main.js, which masks a lead the moment it is added.
function maskPhoneNumber(number) {
  const digits = String(number || "").replace(/\D/g, "");

  if (!digits) {
    return "XXXXXXXXXX";
  }

  return "X".repeat(Math.max(6, digits.length - 4)) + digits.slice(-4);
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

    // Normalize role so NRI / nri / Nri all work.
    const normalizedRole = String(role)
      .trim()
      .toLowerCase();

    // Find the correct Lookup field based on logged-in user's role.
    const lookupField =
      BUYERLEAD_LOOKUP_FIELD[normalizedRole];

    if (!lookupField) {
      return res.status(403).json({
        success: false,
        error: `Role "${normalizedRole}" cannot view Buyer Leads`,
      });
    }

    const accessToken = await getAccessToken();

    // Use the SAME Zoho Search API flow already used
    // for NAR, Partner and Agent.
    const criteria = encodeURIComponent(
      `(${lookupField}:equals:${recordId})`
    );

    const zohoUrl =
      `${process.env.ZOHO_API_DOMAIN}/crm/v2/Leads/search?criteria=${criteria}`;

    console.log("GET BUYER LEADS");
    console.log("Role:", normalizedRole);
    console.log("Record ID:", recordId);
    console.log("Lookup Field:", lookupField);
    console.log("Zoho Search URL:", zohoUrl);

    const zohoRes = await fetch(zohoUrl, {
      method: "GET",
      headers: {
        Authorization:
          `Zoho-oauthtoken ${accessToken}`,
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

    // No records found.
    if (zohoRes.status === 204) {
      return res.status(200).json({
        success: true,
        leads: [],
      });
    }

    // Zoho returned something that is not JSON.
    if (!zohoData) {
      return res.status(500).json({
        success: false,
        error:
          "Zoho CRM returned an invalid response",
        raw: rawText,
      });
    }

    // Zoho returned an error.
    if (!zohoRes.ok) {
      return res.status(zohoRes.status).json({
        success: false,
        error:
          zohoData?.message ||
          zohoData?.code ||
          "Zoho search failed",
        zohoResponse: zohoData,
      });
    }

    if (!Array.isArray(zohoData.data)) {
      return res.status(400).json({
        success: false,
        error:
          zohoData?.message ||
          "Zoho search did not return Buyer Leads",
        zohoResponse: zohoData,
      });
    }

    // Convert CRM Leads into the structure
    // already expected by the existing dashboard.
    const leads = zohoData.data.map((rec) => ({
      id: rec.id,

      // Buyer Name → Last_Name
      buyerName:
        rec.Last_Name ||
        "Unnamed Buyer",

      // Contact Number → Phone
      buyerContact:
        rec.Phone ||
        "",

      buyerContactMasked:
        maskPhoneNumber(rec.Phone),

      // Preferred Location → Preferred_Locations
      preferredLocation:
        rec.Preferred_Locations ||
        "",

      createdAt:
        rec.Created_Time ||
        null,
    }));

    return res.status(200).json({
      success: true,
      leads,
    });

  } catch (err) {
    console.error(
      "get-buyer-leads error:",
      err
    );

    return res.status(500).json({
      success: false,
      error:
        err?.message ||
        "Failed to fetch Buyer Leads",
    });
  }
}