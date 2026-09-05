// /api/submit-to-zoho.js

// Which Lookup field on the Products (property) module links back to
// each role's own module — used to tie a property to its Owner/Agent/etc.
const ROLE_LOOKUP_FIELD = {
  owner: "Seller",
  nar: "NAR_Realtors",
  partner: "Channel_Partners",
  builder: "Builder_Modules",
  agent: "Agent_Modules",
};


// Which Lookup field on the Leads module links the Buyer Lead
// back to the user who captured it.
const BUYERLEAD_LOOKUP_FIELD = {
  nar: "NAR_Realtor",
  partner: "Channel_Partner",
  agent: "Agent",
};

const ROLE_CONFIG = {
  owner: {
    module_api_name: "Sellers",
    fieldMap: {
      fullName: "Name",
      phone: "Phone",
      whatsapp: "WhatsApp_Number",
      email: "Email",
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
      consentGiven: "Description",
      consentAt: "Description",
    },
  },

  property: {
    module_api_name: "Products",
    fieldMap: {
      name: "Product_Name",
      kind: "Property_Kind",
      status: "Property_Status",
      price: "Amount",
      unit: "Property_Unit",
      notes: "Description",
      floors: "Total_Floor",
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
    },
  },
};

import {
  safeReadJson,
  getAccessToken as getCachedAccessToken
} from "./_zohoAuth.js";

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

    const accessToken = await getAccessToken();

    const record = buildZohoRecord(
      formData,
      config.fieldMap
    );

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
      !["nar", "partner", "agent"].includes(
        formData.linkRole
      )
    ) {
      return res.status(403).json({
        success: false,
        error:
          "Only Realtors, Channel Partners, and Associates can add a Buyer Lead.",
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

    const zohoRes = await fetch(zohoUrl, {
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

    const {
      json: zohoData,
      rawText
    } = await safeReadJson(zohoRes);

    console.log(
      "ZOHO CRM RESPONSE STATUS:",
      zohoRes.status
    );

    console.log(
      "ZOHO CRM RESPONSE BODY:",
      rawText
    );

    if (!zohoData) {
      return res.status(502).json({
        success: false,
        error:
          `Zoho returned a non-JSON response (status ${zohoRes.status}): ${rawText}`,
      });
    }

    const result =
      zohoData?.data?.[0];

    if (result?.status === "success") {
      return res.status(200).json({
        success: true,
        zohoRecordId:
          result.details?.id,
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

    return res.status(400).json({
      success: false,
      error:
        result?.message ||
        zohoData?.message ||
        "Zoho CRM rejected the record",
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