// /api/property-image.js
//
// Streams a real attachment image from Zoho CRM through our own server.
// A plain <img src="..."> can't include Zoho's auth token itself, so this
// endpoint fetches the image server-side (with auth) and passes the bytes
// straight through to the browser.
//
// Usage: /api/property-image?module=Products&recordId=XXX&attachmentId=YYY

import { getAccessToken } from "./_zohoAuth.js";

export default async function handler(req, res) {
  try {
    const { module, recordId, attachmentId } = req.query;
    if (!module || !recordId || !attachmentId) {
      return res.status(400).send("Missing module, recordId, or attachmentId");
    }

    const accessToken = await getAccessToken();
    const zohoUrl = `${process.env.ZOHO_API_DOMAIN}/crm/v2/${module}/${recordId}/Attachments/${attachmentId}`;

    const zohoRes = await fetch(zohoUrl, {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
    });

    if (!zohoRes.ok) {
      return res.status(zohoRes.status).send("Failed to fetch image from Zoho");
    }

    const contentType = zohoRes.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await zohoRes.arrayBuffer();

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error("property-image error:", err.message);
    return res.status(500).send("Error fetching image");
  }
}