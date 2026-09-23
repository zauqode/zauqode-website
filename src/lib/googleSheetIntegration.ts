/**
 * ZAUQODE Client Onboarding — Google Sheets Webhook Integration
 *
 * This allows client onboarding briefs to be saved directly into a Google Sheet
 * via a simple, free Google Apps Script Web App.
 */

// Configure your Google Apps Script Web App URL here or in .env as VITE_GOOGLE_SHEET_URL
export const DEFAULT_GOOGLE_SHEET_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_GOOGLE_SHEET_URL) ||
  "";

export interface OnboardingSubmissionData {
  businessName: string;
  contactPerson?: string;
  businessNature: string;
  businessServices: string;
  aboutBusiness: string;
  targetAudience?: string;
  phone: string;
  whatsappDifferent?: string;
  email: string;
  hasLogo?: string;
  logoDriveUrl?: string;
  domainName?: string;
  domainStatus?: string;
  websiteTypes?: string[] | string;
  otherWebsiteType?: string;
  pagesNeeded?: string[] | string;
  designVibe?: string;
  referenceWebsites?: string;
  contentReadiness?: string;
  targetLaunchDate?: string;
  additionalNotes?: string;
  agreedToTerms?: boolean;
}

/**
 * Send onboarding data directly to Google Sheet Web App
 */
export async function sendToGoogleSheet(
  data: OnboardingSubmissionData,
  endpointUrl: string = DEFAULT_GOOGLE_SHEET_URL
): Promise<{ success: boolean; message: string }> {
  // If endpoint is not provided, return helpful instruction
  if (!endpointUrl || !endpointUrl.trim()) {
    console.warn("No Google Sheet Web App URL configured.");
    return {
      success: false,
      message: "NO_ENDPOINT_CONFIGURED",
    };
  }

  try {
    const payload = {
      timestamp: new Date().toISOString(),
      ...data,
      websiteTypes: Array.isArray(data.websiteTypes) ? data.websiteTypes.join(", ") : data.websiteTypes,
      pagesNeeded: Array.isArray(data.pagesNeeded) ? data.pagesNeeded.join(", ") : data.pagesNeeded,
      agreedToTerms: data.agreedToTerms ? "YES" : "NO",
    };

    // Google Apps Script requires mode: 'no-cors' when sending from browser without complex redirect headers
    await fetch(endpointUrl.trim(), {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: "Data successfully sent to Google Sheet",
    };
  } catch (error: any) {
    console.error("Error sending to Google Sheet:", error);
    return {
      success: false,
      message: error?.message || "Failed to communicate with Google Sheet",
    };
  }
}

/**
 * Ready-to-use Google Apps Script code for the user to paste into their Google Sheet
 */
export const GOOGLE_APPS_SCRIPT_TEMPLATE = `function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    
    // Auto-create styled header if sheet is new
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Business Name",
        "Contact Person",
        "Nature of Business",
        "Services / Activity",
        "About the Business",
        "Target Audience",
        "Phone / Mobile",
        "WhatsApp",
        "Email",
        "Logo Status",
        "Logo / Drive Link",
        "Domain Name",
        "Domain Status",
        "Website Types",
        "Pages Needed",
        "Design Vibe",
        "Reference Websites",
        "Content Readiness",
        "Target Launch Date",
        "Additional Notes",
        "Agreed to Terms"
      ]);
      sheet.getRange(1, 1, 1, 22)
        .setFontWeight("bold")
        .setBackground("#0D4747")
        .setFontColor("#FFFFFF")
        .setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
    
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date(),
      data.businessName || "",
      data.contactPerson || "",
      data.businessNature || "",
      data.businessServices || "",
      data.aboutBusiness || "",
      data.targetAudience || "",
      data.phone || "",
      data.whatsappDifferent || data.phone || "",
      data.email || "",
      data.hasLogo || "",
      data.logoDriveUrl || "",
      data.domainName || "",
      data.domainStatus || "",
      Array.isArray(data.websiteTypes) ? data.websiteTypes.join(", ") : (data.websiteTypes || ""),
      Array.isArray(data.pagesNeeded) ? data.pagesNeeded.join(", ") : (data.pagesNeeded || ""),
      data.designVibe || "",
      data.referenceWebsites || "",
      data.contentReadiness || "",
      data.targetLaunchDate || "",
      data.additionalNotes || "",
      data.agreedToTerms === true || data.agreedToTerms === "YES" ? "YES" : "NO"
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Row added" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;
