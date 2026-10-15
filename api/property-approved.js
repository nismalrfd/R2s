// /api/property-approved.js
//
// Sends the owner an e-mail confirmation once their property is approved.
//
// Approval happens inside Zoho CRM, so CRM tells us about it: set up a CRM
// Workflow Rule on the Products module (trigger: the approval / blueprint
// stage becomes "Approved") with a Webhook action:
//
//   POST https://<your-domain>/api/property-approved
//   Header:  x-webhook-secret: <APPROVAL_WEBHOOK_SECRET>
//   Body (JSON):  { "propertyId": "${Products.Product Id}" }
//
// (If the webhook UI can't set headers, put it in the URL instead:
//  /api/property-approved?secret=<APPROVAL_WEBHOOK_SECRET>)
//
// Required env: APPROVAL_WEBHOOK_SECRET (+ the SMTP_* and ZOHO_* variables).
// Optional CRM checkbox field on Products: Approval_Email_Sent — when it
// exists it is ticked after sending, so a repeated webhook can't e-mail twice.

import crypto from "crypto";
import { getAccessToken, safeReadJson } from "./_zohoAuth.js";
import { PRODUCT_ROLE_LOOKUP_FIELD } from "./_zohoConfig.js";
import { sendPropertyApprovedEmail } from "./_propertyMail.js";

// Module that holds the person behind each Products lookup field.
const ROLE_MODULE = {
  owner: "Sellers",
  nar: "NAR_Realtors",
  partner: "Channel_Partners",
  builder: "Builder_Modules",
  agent: "Agent_Modules",
  nri: "NRI",
};

const EMAIL_SENT_FIELD = "Approval_Email_Sent";

function secretMatches(given, expected) {
  const a = Buffer.from(String(given || ""));
  const b = Buffer.from(String(expected || ""));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const expectedSecret = process.env.APPROVAL_WEBHOOK_SECRET;
    if (!expectedSecret || expectedSecret.length < 16) {
      return res.status(500).json({ success: false, error: "APPROVAL_WEBHOOK_SECRET is not configured (min 16 chars)." });
    }
    const givenSecret = req.headers["x-webhook-secret"] || req.query?.secret;
    if (!secretMatches(givenSecret, expectedSecret)) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const body = req.body || {};
    const propertyId = String(body.propertyId || body.id || req.query?.propertyId || "").trim();
    if (!/^\d{15,19}$/.test(propertyId)) {
      return res.status(400).json({ success: false, error: "Missing or invalid propertyId" });
    }

    const token = await getAccessToken();
    const headers = { Authorization: `Zoho-oauthtoken ${token}` };
    const base = process.env.ZOHO_API_DOMAIN;

    const { json: propJson } = await safeReadJson(await fetch(`${base}/crm/v2/Products/${propertyId}`, { headers }));
    const property = propJson?.data?.[0];
    if (!property) {
      return res.status(404).json({ success: false, error: "Property not found" });
    }

    if (property[EMAIL_SENT_FIELD] === true) {
      return res.status(200).json({ success: true, skipped: true, reason: "Approval e-mail was already sent." });
    }

    // Find who listed the property (Seller for owners, etc.) and their e-mail.
    let person = null;
    for (const [role, lookupField] of Object.entries(PRODUCT_ROLE_LOOKUP_FIELD)) {
      const ref = property[lookupField];
      if (ref?.id && ROLE_MODULE[role]) {
        const { json } = await safeReadJson(await fetch(`${base}/crm/v2/${ROLE_MODULE[role]}/${ref.id}`, { headers }));
        person = json?.data?.[0] || null;
        if (person) break;
      }
    }

    const to = String(person?.Email || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(to)) {
      console.warn(`property-approved: no e-mail on file for property ${propertyId}`);
      return res.status(422).json({ success: false, error: "No e-mail address on file for this property's owner." });
    }

    await sendPropertyApprovedEmail({
      to,
      ownerName: person.Name || property.Owner_Name || "",
      propertyName: property.Product_Name || "your property",
      propertyCode: property.Product_Code || "",
      location: property.Location?.name || "",
      propertyLink: property.Property_Link || "",
    });

    // Best effort: remember that it was sent (ignored if the CRM field doesn't exist).
    try {
      await fetch(`${base}/crm/v2/Products`, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ data: [{ id: propertyId, [EMAIL_SENT_FIELD]: true }] }),
      });
    } catch (e) {
      console.warn("property-approved: could not mark e-mail as sent:", e.message);
    }

    return res.status(200).json({ success: true, sent: true });
  } catch (err) {
    console.error("property-approved error:", err.message);
    return res.status(500).json({ success: false, error: "Could not send the approval e-mail." });
  }
}
