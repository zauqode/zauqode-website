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
 */
export function trackMetaPageView() {
  trackMetaEvent("PageView");
}

/**
 * Fires 'Contact' event specifically when a user initiates a WhatsApp enquiry.
 * STRICT: Does NOT report as Lead.
 */
export function trackMetaContact(params?: { source?: string; label?: string; [key: string]: any }) {
  trackMetaEvent("Contact", params);
}

/**
 * Fires 'Lead' event specifically when a user successfully submits an enquiry or onboarding form.
 */
export function trackMetaLead(params?: { formName?: string; category?: string; [key: string]: any }) {
  trackMetaEvent("Lead", params);
}

/**
 * Fires 'ViewContent' event when a user opens and inspects a design showcase or device mockup.
 */
export function trackMetaViewContent(params?: { content_name?: string; content_category?: string; [key: string]: any }) {
  trackMetaEvent("ViewContent", params);
}
