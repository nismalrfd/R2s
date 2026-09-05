// /api/get-admin-stats.js
//
// Req. 11: Admin Dashboard summary tiles.
//
// CHANGED: this used to run 11 Zoho CRM COQL queries, but COQL needs its
// own separate "ZohoCRM.coql.READ" OAuth scope that this app's token
// doesn't have — and re-generating the refresh token isn't an option
// right now. Every module this app already talks to (Products, Leads,
// Builder_Modules, etc.) works fine through the plain List Records API
// with the ZohoCRM.modules.ALL scope the token already has, so this now
// pages through that same API and counts in code instead of asking Zoho
// to count for us. No new scopes, no token changes needed.
//
// Trade-off: this reads real records (id + a couple of small fields)
// instead of a single aggregate number, so it's a bit heavier than COQL
// would be. MAX_PAGES below caps it at 200 * MAX_PAGES records per
// module as a safety net — raise it if any module here genuinely holds
// more than that.
//
// Field/module notes (unchanged from the COQL version):
// - totalBuyerLeads reads the standard "Leads" module (not a custom
//   "Buyer_Leads" module).
// - Advertising_Consent and Video_Promotion_Requested are checkbox
//   (boolean) fields on Products. If they don't exist yet in your Zoho
//   setup, add them via Setup > Modules & Fields > Products — until
//   then they'll just read as false/undefined for every record.

import { getAccessToken, safeReadJson } from "./_zohoAuth.js";

const MAX_PAGES = 50; // 50 * 200 = up to 10,000 records per module

// Pages through GET /crm/v2/{module} collecting only the fields we need,
// until Zoho says there are no more records (or we hit the safety cap).
async function fetchAllRecords(accessToken, moduleName, fields) {
  const records = [];
  let page = 1;
  let moreRecords = true;

  while (moreRecords && page <= MAX_PAGES) {
    const url =
      `${process.env.ZOHO_API_DOMAIN}/crm/v2/${moduleName}` +
      `?fields=${fields.join(",")}&per_page=200&page=${page}`;

    const res = await fetch(url, {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
    });

    // Zoho returns 204 No Content (empty body) when a module has zero
    // matching records — treat that as "done", not an error.
    if (res.status === 204) break;

    const { json, rawText } = await safeReadJson(res);

    if (!res.ok) {
      const reason = json?.message || json?.code || rawText || `HTTP ${res.status}`;
      throw new Error(`${res.status}: ${reason}`);
    }

    const data = json?.data || [];
    records.push(...data);

    moreRecords = !!json?.info?.more_records;
    page += 1;
  }

  return records;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const stats = {};
  const errors = {};

  try {
    const accessToken = await getAccessToken();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // --- Products covers 5 of the 11 tiles — one paginated read, then
    // count all five in memory instead of 5 separate round trips. ---
    try {
      const products = await fetchAllRecords(accessToken, "Products", [
        "id",
        "Created_Time",
        "Advertising_Consent",
        "Video_Promotion_Requested",
      ]);

      stats.totalProperties = products.length;
      stats.propertiesToday = products.filter(
        (p) => p.Created_Time && new Date(p.Created_Time) >= todayStart
      ).length;
      stats.propertiesThisMonth = products.filter(
        (p) => p.Created_Time && new Date(p.Created_Time) >= monthStart
      ).length;
      stats.advertisingRequests = products.filter(
        (p) => p.Advertising_Consent === true
      ).length;
      stats.videoPromotionRequests = products.filter(
        (p) => p.Video_Promotion_Requested === true
      ).length;
    } catch (e) {
      console.warn("Products stats failed:", e.message);
      for (const key of [
        "totalProperties",
        "propertiesToday",
        "propertiesThisMonth",
        "advertisingRequests",
        "videoPromotionRequests",
      ]) {
        stats[key] = 0;
        errors[key] = e.message;
      }
    }

    // --- Builder_Modules splits into Builders vs Staff by whether
    // Staff_Designation is set. ---
    try {
      const builderRecords = await fetchAllRecords(accessToken, "Builder_Modules", [
        "id",
        "Staff_Designation",
      ]);
      stats.totalBuilders = builderRecords.filter((r) => !r.Staff_Designation).length;
      stats.totalStaff = builderRecords.filter((r) => !!r.Staff_Designation).length;
    } catch (e) {
      console.warn("Builder_Modules stats failed:", e.message);
      stats.totalBuilders = 0;
      stats.totalStaff = 0;
      errors.totalBuilders = e.message;
      errors.totalStaff = e.message;
    }

    // --- Everything else is just a plain total count of a module. ---
    const simpleModules = {
      totalRealtors: "NAR_Realtors",
      totalChannelPartners: "Channel_Partners",
      totalAssociates: "Agent_Modules",
      totalBuyerLeads: "Leads",
    };

    await Promise.all(
      Object.entries(simpleModules).map(async ([key, moduleName]) => {
        try {
          const records = await fetchAllRecords(accessToken, moduleName, ["id"]);
          stats[key] = records.length;
        } catch (e) {
          console.warn(`Stat "${key}" failed:`, e.message);
          stats[key] = 0;
          errors[key] = e.message;
        }
      })
    );

    // success stays true so the dashboard still renders the numbers that
    // DID work — but it also gets told which ones didn't, and why.
    return res.status(200).json({
      success: true,
      stats,
      errors: Object.keys(errors).length ? errors : undefined,
    });
  } catch (err) {
    console.error("get-admin-stats error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}