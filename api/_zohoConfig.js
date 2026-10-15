// /api/_zohoConfig.js
// Shared CRM field names, so the endpoint that SAVES a property
// (submit-to-zoho.js) and the one that LOADS them (get-properties.js)
// can never disagree.

// Lookup field on the Products (property) module that links a property
// back to the role's own record. Must be the field's API name, not its label.
//
// If NRI properties save but never load back, this is the value to check:
// Zoho CRM > Setup > Modules and Fields > Products > (the lookup to the
// NRI module) > API name. If it isn't "NRI", either edit it here or set
// ZOHO_PRODUCTS_NRI_FIELD in the environment (.env / Vercel).
export const PRODUCT_ROLE_LOOKUP_FIELD = {
  owner: "Seller",
  nar: "NAR_Realtors",
  partner: "Channel_Partners",
  builder: "Builder_Modules",
  agent: "Agent_Modules",
  nri: process.env.ZOHO_PRODUCTS_NRI_FIELD || "NRI",
};

// ---------------------------------------------------------------------
// SOURCE FIELD — every record the web app creates is stamped with
// Source = "Web App". The API name differs per module:
//   Products ........ Property_Source
//   Leads ........... Lead_Source
//   all role modules  Source
// The value "Web App" MUST exist in each pick list in Zoho CRM
// (Setup > Modules and Fields > <module> > the field > add "Web App"),
// otherwise Zoho rejects the record with INVALID_DATA.
// Override with ZOHO_SOURCE_VALUE if you pick a different label.
// ---------------------------------------------------------------------
export const SOURCE_VALUE = process.env.ZOHO_SOURCE_VALUE || "Web App";

export const SOURCE_FIELD_BY_MODULE = {
  Products: "Property_Source",
  Leads: "Lead_Source",
  Sellers: "Source",
  NAR_Realtors: "Source",
  Channel_Partners: "Source",
  Builder_Modules: "Source",
  Agent_Modules: "Source",
  NRI: "Source",
  Landowners: "Source",
};

// Property documents (title deed, floor plan...) are attached to the same
// Products record as the photos, named "DOC-<sharing>-<file>". Anything that
// shows photos must skip them (a PDF is not a cover image).
export const isImageAttachment = (a) => {
  const name = String(a?.File_Name || a?.file_name || "");
  return !/^DOC-/i.test(name) && !/\.(pdf|docx?|xlsx?|txt|zip)$/i.test(name);
};

// Zoho record ids are 15-19 digit numbers.
export const isZohoId = (v) => /^\d{15,19}$/.test(String(v || ""));
