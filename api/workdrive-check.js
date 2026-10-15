// /api/workdrive-check.js
// Diagnostic: GET /api/workdrive-check?locationId=<CRM Location record id>
// Tells you exactly which link in the CRM -> WorkDrive chain is broken.
import { getAccessToken, safeReadJson } from "./_zohoAuth.js";
import { workdriveBase, getLocationFolder } from "./_workdrive.js";

export default async function handler(req, res) {
  const report = {
    crmApiDomain: process.env.ZOHO_API_DOMAIN,
    isSandbox: /sandbox/i.test(process.env.ZOHO_API_DOMAIN || ""),
    workdriveBase: workdriveBase(),
    checks: [],
  };
  const add = (name, ok, detail) => report.checks.push({ name, ok, detail });

  try {
    const token = await getAccessToken();
    add("CRM access token", true, "ok");

    const r = await fetch(`${workdriveBase()}/users/me`, {
      headers: { Authorization: `Zoho-oauthtoken ${token}` },
    });
    const { rawText } = await safeReadJson(r);
    add(
      "WorkDrive scope on token",
      r.ok,
      r.ok ? "ok" : `HTTP ${r.status} ${rawText.slice(0, 200)} — token lacks WorkDrive scope (WorkDrive.files.ALL, WorkDrive.team.READ) or WorkDrive isn't available for this org/DC`
    );

    const { locationId } = req.query;
    if (locationId) {
      const f = await getLocationFolder(token, locationId);
      add("Location has WorkDrive_Folder_ID", f.ok, f.ok ? f.folderId : f.reason);
      if (f.ok && r.ok) {
        const fr = await fetch(`${workdriveBase()}/files/${f.folderId}`, {
          headers: { Authorization: `Zoho-oauthtoken ${token}` },
        });
        add("Folder exists in WorkDrive", fr.ok, fr.ok ? "ok" : `HTTP ${fr.status} — folder id not found/accessible`);
      }
    } else {
      add("Location check", false, "Pass ?locationId=<id> to test a specific Location");
    }
  } catch (e) {
    add("Exception", false, e.message);
  }
  res.status(200).json(report);
}
