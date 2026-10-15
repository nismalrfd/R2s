// /api/_workdrive.js
// Uploads a file into the Zoho WorkDrive folder that belongs to a CRM
// Location (Locations.WorkDrive_Folder_ID), so images land "location wise".
//
// WorkDrive is a SEPARATE Zoho service from CRM:
//   - it has its own API host  (…/workdrive/api/v1, not …/crm/v2)
//   - the OAuth refresh token must have been generated with WorkDrive
//     scopes (WorkDrive.files.ALL, WorkDrive.team.READ …). A token made
//     only for ZohoCRM.* scopes gets "INVALID_OAUTHSCOPE" here.
//   - the CRM *sandbox* has no live WorkDrive link: the folder id stored
//     on a sandbox Location record usually points at nothing.

import { getAccessToken, safeReadJson } from "./_zohoAuth.js";

export function workdriveBase() {
  if (process.env.ZOHO_WORKDRIVE_DOMAIN) {
    return process.env.ZOHO_WORKDRIVE_DOMAIN.replace(/\/$/, "");
  }
  // accounts.zoho.in -> www.zohoapis.in ; accounts.zoho.com -> www.zohoapis.com
  const tld = (process.env.ZOHO_ACCOUNTS_DOMAIN || "").match(/zoho\.([a-z.]+)$/i)?.[1] || "com";
  return `https://www.zohoapis.${tld}/workdrive/api/v1`;
}

export async function getLocationFolder(accessToken, locationId) {
  const url = `${process.env.ZOHO_API_DOMAIN}/crm/v2/Locations/${locationId}`;
  const r = await fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${accessToken}` } });
  const { json, rawText } = await safeReadJson(r);
  const rec = json?.data?.[0];
  if (!rec) {
    return { ok: false, reason: `Location record ${locationId} not found in CRM (${r.status}): ${rawText.slice(0, 200)}` };
  }
  const folderId = (rec.WorkDrive_Folder_ID || "").trim();
  if (!folderId) {
    return {
      ok: false,
      reason: `Location "${rec.Name}" has an empty WorkDrive_Folder_ID. Fill it with the WorkDrive folder id for this location (or let the CRM WorkDrive workflow create it) before uploading.`,
      locationName: rec.Name,
    };
  }
  return { ok: true, folderId, locationName: rec.Name };
}

export async function uploadToWorkDrive({ locationId, fileName, buffer, mimeType }) {
  try {
    const accessToken = await getAccessToken();
    const folder = await getLocationFolder(accessToken, locationId);
    if (!folder.ok) return folder;

    const form = new FormData();
    form.append("content", new Blob([buffer], { type: mimeType || "application/octet-stream" }), fileName);

    const url =
      `${workdriveBase()}/upload?parent_id=${encodeURIComponent(folder.folderId)}` +
      `&filename=${encodeURIComponent(fileName)}&override-name-exist=true`;

    const r = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
      body: form,
    });
    const { json, rawText } = await safeReadJson(r);
    console.log("WORKDRIVE UPLOAD RESPONSE:", r.status, rawText.slice(0, 500));

    const attrs = json?.data?.[0]?.attributes;
    if (r.ok && attrs) {
      return {
        ok: true,
        locationName: folder.locationName,
        folderId: folder.folderId,
        fileId: json.data[0].id || attrs.resource_id,
        link: attrs.Permalink || attrs.permalink || null,
      };
    }

    let reason = `WorkDrive rejected the upload (HTTP ${r.status}).`;
    const errMsg = JSON.stringify(json?.errors || json || rawText).slice(0, 300);
    if (/OAUTH|SCOPE/i.test(errMsg)) {
      reason += " The refresh token has no WorkDrive scope — regenerate it including WorkDrive.files.ALL.";
    } else if (r.status === 404 || /INVALID_ID|not.?found/i.test(errMsg)) {
      reason += ` Folder id "${folder.folderId}" doesn't exist in WorkDrive (typical when a sandbox Location holds a production/placeholder id).`;
    }
    return { ok: false, reason: `${reason} Detail: ${errMsg}` };
  } catch (e) {
    return { ok: false, reason: `WorkDrive call failed: ${e.message}` };
  }
}
