// /api/property-status.js
// Diagnostic for the CRM-side WorkDrive automation (the Deluge function
// "automation.WorkdriveLink"). GET /api/property-status?id=<Products record id>
// Shows which input the function needs is missing, and whether it ran.
import { getAccessToken, safeReadJson } from "./_zohoAuth.js";

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ success: false, error: "Missing id" });
  const token = await getAccessToken();
  const H = { headers: { Authorization: `Zoho-oauthtoken ${token}` } };
  const base = process.env.ZOHO_API_DOMAIN;

  const { json } = await safeReadJson(await fetch(`${base}/crm/v2/Products/${id}`, H));
  const p = json?.data?.[0];
  if (!p) return res.status(404).json({ success: false, error: "Product not found", zoho: json });

  const checks = [];
  const add = (name, ok, detail) => checks.push({ name, ok, detail });
  add("Source stamped", p.Property_Source === "Web App", p.Property_Source || "empty");
  add("Location lookup filled", !!p.Location?.id, p.Location?.name || "EMPTY — the function does nothing / errors without it");
  add("Auto_Number present", !!p.Auto_Number, p.Auto_Number || "empty");

  if (p.Location?.id) {
    const lr = await safeReadJson(await fetch(`${base}/crm/v2/Locations/${p.Location.id}`, H));
    const folder = lr.json?.data?.[0]?.WorkDrive_Folder_ID;
    add("Location.WorkDrive_Folder_ID filled", !!folder, folder || "EMPTY — function skips folder creation silently");
  }
  add("Function ran: Product_Code set", !!p.Product_Code, p.Product_Code || "empty");
  add("Function ran: WorkDrive_Folder_ID on property", !!p.WorkDrive_Folder_ID, p.WorkDrive_Folder_ID || "empty");
  add("Function ran: Property_Link set", !!p.Property_Link, p.Property_Link || "empty");

  res.status(200).json({ success: true, name: p.Product_Name, checks });
}
