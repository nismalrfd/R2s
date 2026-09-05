// /api/upload-attachment.js
//
// Uploads a single file to Zoho CRM as an Attachment on an existing record.
// Expects JSON body: { module, recordId, fileName, fileBase64 }
//   - module:     e.g. "Products"
//   - recordId:   the Zoho record ID to attach the file to
//   - fileName:   original file name, e.g. "front-view.jpg"
//   - fileBase64: the file's contents, base64-encoded (no "data:" prefix)

import { getAccessToken, safeReadJson } from "./_zohoAuth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { module, recordId, fileName, fileBase64 } = req.body;

    if (!module || !recordId || !fileName || !fileBase64) {
      return res.status(400).json({
        success: false,
        error: "Missing one of: module, recordId, fileName, fileBase64",
      });
    }

    const accessToken = await getAccessToken();

    // Convert the base64 string back into real binary file data
    const buffer = Buffer.from(fileBase64, "base64");
    const blob = new Blob([buffer]);

    const formData = new FormData();
    formData.append("file", blob, fileName);

    const zohoUrl = `${process.env.ZOHO_API_DOMAIN}/crm/v2/${module}/${recordId}/Attachments`;
    console.log("UPLOADING ATTACHMENT TO:", zohoUrl, "fileName:", fileName);

    const zohoRes = await fetch(zohoUrl, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        // Note: no Content-Type header here — fetch sets the correct
        // multipart boundary automatically when the body is a FormData.
      },
      body: formData,
    });

    const { json: zohoData, rawText } = await safeReadJson(zohoRes);
    console.log("ATTACHMENT UPLOAD RESPONSE:", zohoRes.status, rawText);

    if (!zohoData) {
      return res.status(502).json({
        success: false,
        error: `Zoho returned a non-JSON response (status ${zohoRes.status}): ${rawText}`,
      });
    }

    const result = zohoData?.data?.[0];
    if (result?.status === "success") {
      return res.status(200).json({ success: true, attachmentId: result.details?.id });
    }

    return res.status(400).json({
      success: false,
      error: result?.message || zohoData?.message || "Zoho rejected the attachment",
      zohoResponse: zohoData,
    });
  } catch (err) {
    console.error("upload-attachment error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}