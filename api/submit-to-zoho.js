// /api/submit-to-zoho.js

import {
  PRODUCT_ROLE_LOOKUP_FIELD,
  SOURCE_VALUE,
  SOURCE_FIELD_BY_MODULE,
  isZohoId,
} from "./_zohoConfig.js";
import { normalizePhone, isValidPhone } from "./_smsOtp.js";
import { safeReadJson, getAccessToken as getCachedAccessToken } from "./_zohoAuth.js";

// Which Lookup field on the Products (property) module links back to
// each role's own module lives in _zohoConfig.js (shared with
// get-properties.js, so saving and loading always use the same field).
const ROLE_LOOKUP_FIELD = PRODUCT_ROLE_LOOKUP_FIELD;

const ROLE_PHONE_FIELDS = {
  owner: ["Phone"],
  nar: ["Phone"],
  partner: ["Phone"],
  builder: ["Primary_Contact_Number", "Phone"],
  agent: ["Phone"],
  nri: ["Phone_1"],
};

async function findExistingByPhone(accessToken, role, phone) {
  const config = ROLE_CONFIG[role];
  const fields = ROLE_PHONE_FIELDS[role] || [];
  if (!config || !fields.length || !phone) return null;

  for (const field of fields) {
    const criteria = `(${field}:equals:${phone})`;
    const url = `${process.env.ZOHO_API_DOMAIN}/crm/v2/${config.module_api_name}/search?criteria=${encodeURIComponent(criteria)}`;
    const response = await fetch(url, {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
    });
    if (response.status === 204) continue;
    const data = await response.json().catch(() => ({}));
    if (response.ok && Array.isArray(data.data) && data.data.length) {
      return data.data[0];
    }
  }
  return null;
}



// Which Lookup field on the Leads module links the Buyer Lead
// back to the user who captured it.
const BUYERLEAD_LOOKUP_FIELD = {
  nar: "NAR_Realtor",
  partner: "Channel_Partner",
  agent: "Agent",
  nri: "NRI",
};

const ROLE_CONFIG = {
  owner: {
    module_api_name: "Sellers",
    fieldMap: {
      fullName: "Name",
      phone: "Phone",
      whatsapp: "WhatsApp_Number",
      email: "Email",
      // Owner signup "Referral" (single-line text). See OPTIONAL_ZOHO_FIELDS.
      ownerReferral: "Referral",
    },
  },

  nar: {
    module_api_name: "NAR_Realtors",
    fieldMap: {
      fullName: "Name",
      phone: "Phone",
      whatsapp: "WhatsApp_Number",
      email: "Email",
      narReraNumber: "RERA_Register_Number",
      // Mandatory NAR Number entered at signup. See OPTIONAL_ZOHO_FIELDS.
      narId: "NAR_Number",
      // PLACEHOLDER: assumed Zoho field API name for the auto-generated
      // unique member code — confirm/rename to match the real custom
      // field on this module.
      uniqueCode: "Unique_Code",
    },
  },

  partner: {
    module_api_name: "Channel_Partners",
    fieldMap: {
      fullName: "Name",
      phone: "Phone",
      whatsapp: "WhatsApp_Number",
      email: "Email",
      reraRegistered: "RERA_Registered",
      reraNumber: "RERA_Register_Number",
      uniqueCode: "Unique_Code",
    },
  },

  builder: {
    module_api_name: "Builder_Modules",
    fieldMap: {
      builderName: "Name",
      email: "Email",
      primaryContactName: "Primary_Contact_Name",
      primaryContactPhone: "Primary_Contact_Number",
      projectName: "Project_Name",
    },
  },

  agent: {
    module_api_name: "Agent_Modules",
    fieldMap: {
      fullName: "Name",
      phone: "Phone",
      whatsapp: "WhatsApp_Number",
      email: "Email",
      uniqueCode: "Unique_Code",
    },
  },

  nri: {
    module_api_name: "NRI",
    fieldMap: {
      fullName: "Name",
      phone: "Phone_1",
      email: "Email",
      nriCountry: "Address_1_Country_Region",
      // NRI Secondary Contact. See OPTIONAL_ZOHO_FIELDS.
      nriSecondaryName: "Secondary_Contact_Name",
      nriSecondaryPhone: "Secondary_Contact_Number",
    },
  },

  // Buyer Lead
  // Buyer details are stored in the existing Zoho CRM Leads module.
  buyerlead: {
    module_api_name: "Leads",
    fieldMap: {
      buyerName: "Last_Name",
      buyerContact: "Phone",
      preferredLocation: "Preferred_Locations",
      // consentGiven is rewritten server-side into one readable line
      // (permission + timestamp + who captured it) before the record is built.
      consentGiven: "Description",
    },
  },

  property: {
    module_api_name: "Products",
    fieldMap: {
      // PLACEHOLDER: assumed Zoho field API names for the new Owner
      // fields — confirm/rename to match the real custom fields on the
      // Products module in Zoho.
      ownerName: "Owner_Name",
      ownerPhone: "Owner_Phone_Number",
      name: "Product_Name",
      kind: "Property_Kind",
      status: "Property_Status",
      price: "Amount",
      unit: "Property_Unit",
      notes: "Description",
      floors: "Total_Floor",
      location: "Location",
      serviceType: "Property_Service_Type",
      resType: "Residential_Type",
      comType: "Commercial_Type",
      estType: "Estate_Type",
      date: "Available_From_Date",

      advertisingConsent: "Advertising_Consent",
      advertisingConsentAt: "Advertising_Consent_At",
      advertisingConsentBy: "Advertising_Consent_By",
      advertisingPlatforms: "Advertising_Platforms",
      videoPromotionRequested: "Video_Promotion_Requested",
      // Who the uploaded property documents may be shared with. See OPTIONAL_ZOHO_FIELDS.
      documentsSharing: "Document_Sharing",
    },
  },
};

// Fields added after the CRM schema was first set up. The API names above are
// our best guess; if one doesn't exist (yet) in Zoho, Zoho rejects the whole
// record. For these fields only, we drop the rejected field and retry so a
// signup / property is never lost because of a missing optional CRM field.
// Create the field in Zoho with the API name shown (or rename it above) and it
// starts saving automatically. Dropped fields are logged and returned in the
// response as `droppedFields`.
const OPTIONAL_ZOHO_FIELDS = new Set([
  "Referral",
  "NAR_Number",
  "Secondary_Contact_Name",
  "Secondary_Contact_Number",
  "Document_Sharing",
]);

// Wraps the shared, cached token getter with the same debug logging this
// file already had. The actual caching lives in _zohoAuth.js.
async function getAccessToken() {
  console.log("ENV CHECK:", {
    hasClientId: !!process.env.ZOHO_CLIENT_ID,
    hasClientSecret: !!process.env.ZOHO_CLIENT_SECRET,
    hasRefreshToken: !!process.env.ZOHO_REFRESH_TOKEN,
    accountsDomain: process.env.ZOHO_ACCOUNTS_DOMAIN,
    apiDomain: process.env.ZOHO_API_DOMAIN,
  });

  return getCachedAccessToken();
}

// Every NAR Realtor, Channel Partner, and Associate (Agent) gets a unique,
// auto-generated member code. There's no shared counter/database here, so
// uniqueness comes from combining the current time (base-36, to the
// millisecond) with a random suffix — collision odds are negligible for
// this app's signup volume.
const UNIQUE_CODE_PREFIX = {
  nar: "NAR",
  partner: "CP",
  agent: "ASC",
};

function generateUniqueCode(prefix) {
  const timePart = Date.now().toString(36).toUpperCase();
  const randPart = Math.floor(100 + Math.random() * 900); // 3 digits
  return `${prefix}-${timePart}-${randPart}`;
}

function buildZohoRecord(formData, fieldMap) {
  const record = {};

  // Fields that are Checkbox (boolean) type in Zoho — the form sends
  // these as the string "Yes"/"No", but Zoho's API needs true/false or
  // it will reject the record. Previously only RERA_Registered was
  // converted, so Advertising_Consent and Video_Promotion_Requested
  // (added for Req. 11's dashboard tiles) were being sent as raw
  // strings and silently failing/mismatching against the checkbox
  // fields created for them.
  const BOOLEAN_FIELDS = new Set([
    "RERA_Registered",
    "Advertising_Consent",
    "Video_Promotion_Requested",
  ]);

  // Lookup fields need Zoho's { id: "<record id>" } shape, not a bare
  // string — same convention already used for Seller/NAR_Realtors/etc.
  // via ROLE_LOOKUP_FIELD below. The Location dropdown sends the Zoho
  // record id of the selected Locations-module record as its value.
  const LOOKUP_FIELDS = new Set(["Location"]);

  for (const [formKey, zohoFieldApiName] of Object.entries(fieldMap)) {
    if (
      formData[formKey] !== undefined &&
      formData[formKey] !== ""
    ) {
      let value = formData[formKey];

      if (BOOLEAN_FIELDS.has(zohoFieldApiName)) {
        value =
          value === "Yes" || value === true
            ? true
            : value === "No" || value === false
            ? false
            : value;
      } else if (LOOKUP_FIELDS.has(zohoFieldApiName)) {
        value = { id: value };
      }

      record[zohoFieldApiName] = value;
    }
  }

  return record;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const {
      formType,
      role,
      ...formData
    } = req.body;

    const configKey =
      formType === "property"
        ? "property"
        : formType === "buyerlead"
        ? "buyerlead"
        : role;

    const config = ROLE_CONFIG[configKey];

    if (!config) {
      return res.status(400).json({
        success: false,
        error: `No Zoho module configured for "${configKey}"`,
      });
    }

    if (formType === "registration" && role === "builder" && formData.phone && !formData.primaryContactPhone) {
      formData.primaryContactPhone = formData.phone;
    }

    const accessToken = await getAccessToken();

    if (formType === "registration") {
      const phone = normalizePhone(formData.phone);

      // One mobile number is allowed once per user type/module.
      // The same number can therefore be used for Builder and Owner,
      // but not twice for Builder.
      const existing = await findExistingByPhone(accessToken, role, phone);
      if (existing) {
        return res.status(409).json({
          success: false,
          code: "USER_ALREADY_EXISTS",
          error: `This mobile number is already registered as ${role}. Please sign in instead or use another number.`,
          existingRecordId: existing.id,
        });
      }
    }

    if (formType === "buyerlead" && formData.buyerContact) {
      const buyerPhone = String(formData.buyerContact).replace(/\D/g, "");
      if (buyerPhone.length >= 10) {
        const criteria = `(Phone:equals:${buyerPhone})`;
        const buyerUrl = `${process.env.ZOHO_API_DOMAIN}/crm/v2/Leads/search?criteria=${encodeURIComponent(criteria)}`;
        const buyerRes = await fetch(buyerUrl, {
          headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
        });
        if (buyerRes.status !== 204) {
          const buyerData = await buyerRes.json().catch(() => ({}));
          if (buyerRes.ok && Array.isArray(buyerData.data) && buyerData.data.length) {
            return res.status(409).json({
              success: false,
              code: "BUYER_ALREADY_EXISTS",
              error: "A buyer lead with this mobile number already exists.",
              existingRecordId: buyerData.data[0].id,
            });
          }
        }
      }
    }

    // Network Leads: the lead owner's permission must be given BEFORE the lead
    // is added. The form enforces this with a required checkbox; this makes it
    // impossible to bypass by calling the API directly.
    if (formType === "buyerlead") {
      if (formData.consentGiven !== "Yes") {
        return res.status(400).json({
          success: false,
          code: "PERMISSION_REQUIRED",
          error: "The lead owner's permission is required before adding a network lead.",
        });
      }
      const when = formData.consentAt || new Date().toISOString();
      formData.consentGiven =
        `Lead owner's permission obtained: Yes (${when}). Captured by: ${formData.linkRole || "unknown"}.`;
    }

    // Auto-generate the member code for roles that need one, before the
    // record is built, so it's included in the same create call.
    let generatedUniqueCode = null;
    if (UNIQUE_CODE_PREFIX[configKey]) {
      generatedUniqueCode = generateUniqueCode(UNIQUE_CODE_PREFIX[configKey]);
      formData.uniqueCode = generatedUniqueCode;
    }

    // A property MUST carry a real Location record id. The Location
    // lookup drives the WorkDrive folder / image upload and the CRM
    // blueprint, and a free-text value (e.g. "Kochi, Kerala") is not a
    // valid lookup id — Zoho rejects the whole record when it is sent.
    if (formType === "property" && !isZohoId(formData.location)) {
      return res.status(400).json({
        success: false,
        code: "LOCATION_REQUIRED",
        error: "Please select a Location from the list before saving the property.",
      });
    }

    const record = buildZohoRecord(
      formData,
      config.fieldMap
    );

    // Stamp the Source on every record created from the web app. Done
    // server-side so it can never be skipped or changed by the browser.
    const sourceField = SOURCE_FIELD_BY_MODULE[config.module_api_name];
    if (sourceField) {
      record[sourceField] = SOURCE_VALUE;
    }

    // Link the submitted record to the logged-in user's
    // existing CRM record.
    //
    // Property:
    //   owner  → Seller
    //   nar    → NAR_Realtors
    //   partner → Channel_Partners
    //   builder → Builder_Modules
    //   agent  → Agent_Modules
    //
    // Buyer Lead:
    //   nar     → NAR_Realtor
    //   partner → Channel_Partner
    //   agent   → Agent
    if (
      (formType === "property" ||
        formType === "buyerlead") &&
      formData.linkRole &&
      formData.linkId
    ) {
      const lookupMap =
        formType === "buyerlead"
          ? BUYERLEAD_LOOKUP_FIELD
          : ROLE_LOOKUP_FIELD;

      const lookupField =
        lookupMap[formData.linkRole];

      if (lookupField) {
        record[lookupField] = {
          id: formData.linkId
        };
      }
    }

    // Req. 7.1:
    // Only Realtor, Channel Partner, and Associate
    // can create a Buyer Lead.
    if (
      formType === "buyerlead" &&
      !["nar", "partner", "agent", "nri"].includes(
        formData.linkRole
      )
    ) {
      return res.status(403).json({
        success: false,
        error:
          "Only authorized network roles can add a Buyer Lead.",
      });
    }

    const zohoUrl =
      `${process.env.ZOHO_API_DOMAIN}/crm/v2/${config.module_api_name}`;

    console.log(
      "CALLING ZOHO CRM URL:",
      zohoUrl
    );

    console.log(
      "RECORD PAYLOAD:",
      JSON.stringify(record)
    );

    // Create the record. If Zoho rejects one of OPTIONAL_ZOHO_FIELDS (the field
    // doesn't exist in the CRM yet), drop just that field and try again.
    const droppedFields = [];
    let zohoRes, zohoData, rawText, result;
    for (let attempt = 0; attempt <= OPTIONAL_ZOHO_FIELDS.size; attempt++) {
      zohoRes = await fetch(zohoUrl, {
        method: "POST",
        headers: {
          Authorization:
            `Zoho-oauthtoken ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [record]
        }),
      });

      ({ json: zohoData, rawText } = await safeReadJson(zohoRes));

      console.log(
        "ZOHO CRM RESPONSE STATUS:",
        zohoRes.status
      );

      console.log(
        "ZOHO CRM RESPONSE BODY:",
        rawText
      );

      result = zohoData?.data?.[0];
      const rejectedField = result?.details?.api_name;
      if (
        result?.status !== "success" &&
        rejectedField &&
        OPTIONAL_ZOHO_FIELDS.has(rejectedField) &&
        rejectedField in record
      ) {
        console.warn(
          `Optional CRM field "${rejectedField}" was rejected by Zoho (${result.code}); ` +
          `saving the record without it. Create/rename this field in Zoho to store it.`
        );
        delete record[rejectedField];
        droppedFields.push(rejectedField);
        continue;
      }
      break;
    }

    if (!zohoData) {
      return res.status(502).json({
        success: false,
        error:
          `Zoho returned a non-JSON response (status ${zohoRes.status}): ${rawText}`,
      });
    }

    if (result?.status === "success") {
      return res.status(200).json({
        success: true,
        zohoRecordId:
          result.details?.id,
        uniqueCode: generatedUniqueCode,
        ...(droppedFields.length ? { droppedFields } : {}),
      });
    }

    // FIX: "duplicate data" from Zoho was being passed straight through
    // as the whole error message, so a failed submit just looked like a
    // generic red X to the user with no way to tell what to change.
    // Zoho's Products module (and several others) treat their primary
    // Name field as unique — submitting the same name twice is expected
    // to be rejected, not a bug — but the app needs to actually say so.
    if (result?.code === "DUPLICATE_DATA") {
      const dupFieldApiName = result.details?.api_name;
      const dupFormKey = Object.entries(config.fieldMap).find(
        ([, apiName]) => apiName === dupFieldApiName
      )?.[0];
      const label = dupFormKey || dupFieldApiName || "value";

      return res.status(409).json({
        success: false,
        code: "DUPLICATE_DATA",
        error: `A record with this "${label}" already exists in Zoho CRM. Please use a different value and try again.`,
        duplicateField: dupFieldApiName,
        existingRecordId: result.details?.id,
        zohoResponse: zohoData,
      });
    }

    // Make the real reason visible (picklist value missing, mandatory
    // field empty, blueprint/validation rule, etc.) instead of a bare
    // "rejected" message.
    const apiName = result?.details?.api_name;
    const hint =
      result?.code === "INVALID_DATA" && apiName
        ? ` (field "${apiName}" — check the value exists in the CRM pick list / is valid)`
        : result?.code === "MANDATORY_NOT_FOUND" && apiName
        ? ` (required field "${apiName}" is empty)`
        : "";
    console.error("ZOHO REJECTED RECORD:", JSON.stringify(result));
    return res.status(400).json({
      success: false,
      code: result?.code,
      error:
        (result?.message ||
          zohoData?.message ||
          "Zoho CRM rejected the record") + hint,
      zohoResponse: zohoData,
    });

  } catch (err) {
    console.error(
      "submit-to-zoho error:",
      err.message
    );

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}