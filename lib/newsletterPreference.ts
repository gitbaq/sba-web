/** Best-effort local hint that this browser has subscribed or confirmed. */

export const NEWSLETTER_SUBSCRIBED_KEY = "sba-newsletter-subscribed";

export function isNewsletterSubscribed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(NEWSLETTER_SUBSCRIBED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markNewsletterSubscribed(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NEWSLETTER_SUBSCRIBED_KEY, "1");
  } catch {
    // ignore quota / private mode
  }
}
