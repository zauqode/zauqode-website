/**
 * Meta Pixel Tracking Utility for ZAUQODE
 * Official Pixel ID: 1636316038192665
 */

export const META_PIXEL_ID = "1636316038192665";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: (...args: any[]) => void;
  }
}

// In-memory timestamps and signatures to prevent duplicate rapid events (debouncing & deduplication)
let lastContactTrackTime = 0;
let lastContactSignature = "";

let lastLeadTrackTime = 0;
let lastLeadSignature = "";

let lastPageViewTime = 0;
let lastPageViewPath = "";

/**
 * Safely calls window.fbq if available in browser runtime.
 */
export function trackMetaEvent(event: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    try {
      if (params) {
        window.fbq("track", event, params);
      } else {
        window.fbq("track", event);
      }
    } catch (err) {
      console.warn("[Meta Pixel] Error tracking event:", event, err);
    }
  }
}

/**
 * Fires 'PageView' event on client-side route transitions.
 * Deduplicates multiple calls on the same pathname within 600ms.
 */
export function trackMetaPageView(path?: string) {
  const currentPath =
    path || (typeof window !== "undefined" ? window.location.pathname : "");
  const now = Date.now();
  if (now - lastPageViewTime < 600 && lastPageViewPath === currentPath) {
    return;
  }
  lastPageViewTime = now;
  lastPageViewPath = currentPath;
  trackMetaEvent("PageView");
}

/**
 * Fires 'Contact' event specifically when a user initiates a WhatsApp enquiry
 * (via direct button clicks or submitting a form that redirects to WhatsApp).
 * Deduplicates rapid double-clicks within 1000ms.
 */
export function trackMetaContact(params?: { source?: string; label?: string; [key: string]: any }) {
  const now = Date.now();
  const signature = JSON.stringify(params || {});
  if (now - lastContactTrackTime < 1000 && lastContactSignature === signature) {
    return;
  }
  lastContactTrackTime = now;
  lastContactSignature = signature;
  trackMetaEvent("Contact", params);
}

/**
 * Fires 'Lead' event ONLY for genuine, completed website enquiry/order submissions
 * that are independently submitted and recorded directly on the website.
 * STRICT: Do not fire for forms that merely redirect to WhatsApp.
 * Deduplicates repeated form submissions within 2000ms.
 */
export function trackMetaLead(params?: { formName?: string; category?: string; [key: string]: any }) {
  const now = Date.now();
  const signature = JSON.stringify(params || {});
  if (now - lastLeadTrackTime < 2000 && lastLeadSignature === signature) {
    return;
  }
  lastLeadTrackTime = now;
  lastLeadSignature = signature;
  trackMetaEvent("Lead", params);
}

/**
 * Fires 'ViewContent' event when a user opens and inspects a design showcase or device mockup.
 */
export function trackMetaViewContent(params?: { content_name?: string; content_category?: string; [key: string]: any }) {
  trackMetaEvent("ViewContent", params);
}
