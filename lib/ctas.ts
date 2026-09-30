import { LINKEDIN_URL } from "@/lib/audience";

/** Canonical CTA labels - same wording everywhere. */
export const CTA = {
  subscribe: "Get Weekly Insights",
  writing: "Explore Essays & Research",
  work: "View Work",
  contact: "Contact",
  linkedin: "Connect on LinkedIn",
  calendly: "Book 30 min",
  rss: "RSS",
} as const;

/**
 * Preferred left→right order for shared CTAs.
 * LinkedIn is always last when present.
 */
export const CTA_ORDER = [
  "subscribe",
  "writing",
  "work",
  "contact",
  "calendly",
  "rss",
  "linkedin",
] as const;

export type CtaKey = (typeof CTA_ORDER)[number];

export { LINKEDIN_URL };
