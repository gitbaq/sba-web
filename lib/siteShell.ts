import { github_url } from "@/utils/endpoints/endpoints";
import { SITE } from "@/lib/seo";

/** Primary header nav (desktop + mobile). */
export const PRIMARY_NAV = [
  { href: "/writing", label: "Writing" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/work-with-me", label: "Work with me" },
  { href: "/subscribe", label: "Subscribe", emphasize: true },
] as const;

/** Footer Explore column. Login is rendered separately (client return URL). */
export const FOOTER_NAV = [
  { href: "/writing", label: "Writing" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/work-with-me", label: "Work with me" },
  { href: "/subscribe", label: "Subscribe" },
  { href: "/writing/series", label: "Series" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/feed.xml", label: "RSS", external: true },
] as const;

/**
 * Footer Projects. Names match Work case studies (no competing Substack signup).
 */
export const FOOTER_PROJECTS = [
  { href: "/work/cobu", label: "Cobu: AI brainstorm buddy" },
  { href: "/work/blox", label: "Blox: Productivity hub" },
  { href: github_url, label: "Code on GitHub" },
] as const;

export const SOCIAL_LINKS = [
  {
    href: SITE.linkedin,
    label: "LinkedIn profile",
    key: "linkedin" as const,
  },
  {
    href: SITE.x,
    label: "X profile",
    key: "x" as const,
  },
  {
    href: SITE.calendly,
    label: "Book a call on Calendly",
    key: "calendly" as const,
  },
] as const;
