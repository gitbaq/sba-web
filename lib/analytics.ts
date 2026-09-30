/** GA4 helpers - safe no-ops when gtag is unavailable (SSR / blocked). */

export type AnalyticsEvent =
  | "subscribe_submit"
  | "audience_select"
  | "cta_click"
  | "article_read_depth"
  | "contact_submit";

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js" | "set",
      targetOrName: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

export function trackEvent(
  name: AnalyticsEvent | string,
  params?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", name, params);
  } catch {
    /* analytics must never break UX */
  }
}

export function trackCta(label: string, href: string, location: string) {
  trackEvent("cta_click", {
    cta_label: label,
    cta_href: href,
    cta_location: location,
  });
}
