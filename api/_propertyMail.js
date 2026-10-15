// /api/_propertyMail.js
// Notification handler for approved properties.

export async function sendPropertyApprovedEmail({ to, ownerName, propertyName, propertyCode, location, propertyLink }) {
  console.log(`[Property Approved] Notification ready for ${ownerName} (${to}) - ${propertyName} [${propertyCode}]`);
  return { success: true };
}
