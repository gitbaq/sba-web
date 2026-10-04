import {
  about_config_url,
  blox_url,
  cobu_url,
  github_url,
  work_projects_url,
} from "@/utils/endpoints/endpoints";
import { readJson } from "@/lib/http";

export type CaseStudy = {
  id?: number;
  slug: string;
  title: string;
  tagline: string;
  href: string;
  externalUrl?: string;
  mark: string;
  role: string;
  timeline: string;
  result: string;
  problem: string;
  approach: string[];
  outcome: string[];
  stack: string[];
  sortOrder?: number;
  isVisible?: boolean;
};

export type Credential = {
  label: string;
  href?: string;
};

export type AboutConfig = {
  displayName: string;
  title: string;
  bio: string;
  photoUrl: string;
  hiringBlurb: string;
  homeBlurb: string;
  credentials: Credential[];
};

/** Empty about shape for admin forms. Never used as public page content. */
export const EMPTY_ABOUT: AboutConfig = {
  displayName: "",
  title: "",
  bio: "",
  photoUrl: "",
  hiringBlurb: "",
  homeBlurb: "",
  credentials: [],
};

function sanitizeVisitorCopy(text: string): string {
  return text.replace(
    /still maturing toward full capability/gi,
    "in active development"
  );
}

function mapProject(raw: Record<string, unknown>): CaseStudy {
  const slug = String(raw.slug || "");
  return {
    id: raw.id != null ? Number(raw.id) : undefined,
    slug,
    title: String(raw.title || ""),
    tagline: String(raw.tagline || ""),
    href: `/work/${slug}`,
    externalUrl: raw.externalUrl ? String(raw.externalUrl) : undefined,
    mark: String(raw.mark || ""),
    role: String(raw.role || ""),
    timeline: String(raw.timeline || ""),
    result: sanitizeVisitorCopy(String(raw.result || "")),
    problem: String(raw.problem || ""),
    approach: Array.isArray(raw.approach) ? raw.approach.map(String) : [],
    outcome: Array.isArray(raw.outcome) ? raw.outcome.map(String) : [],
    stack: Array.isArray(raw.stack)
      ? raw.stack.map(String).filter(Boolean)
      : [],
    sortOrder: raw.sortOrder != null ? Number(raw.sortOrder) : undefined,
    isVisible:
      raw.isVisible === undefined ? true : Boolean(raw.isVisible),
  };
}

/** Public work list from API only. No seed / fallback projects. */
export async function getWorkProjects(): Promise<CaseStudy[]> {
  try {
    const res = await fetch(work_projects_url, {
      next: { revalidate: 60, tags: ["work-projects"] },
    });
    if (!res.ok) return [];
    const data = await readJson<unknown[]>(res, []);
    if (!Array.isArray(data)) return [];
    return data
      .map((raw) => mapProject(raw as Record<string, unknown>))
      .filter((p) => p.slug && p.title);
  } catch {
    return [];
  }
}

/** Public case study from API only. Undefined when missing (caller should 404). */
export async function getWorkProject(
  slug: string
): Promise<CaseStudy | undefined> {
  try {
    const res = await fetch(`${work_projects_url}/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60, tags: ["work-projects"] },
    });
    if (!res.ok) return undefined;
    const data = await readJson<Record<string, unknown> | null>(res, null);
    if (!data) return undefined;
    const mapped = mapProject(data);
    return mapped.slug && mapped.title ? mapped : undefined;
  } catch {
    return undefined;
  }
}

const STALE_ABOUT_TITLES = new Set([
  "Software innovation and AI leader",
  "Software Innovation and AI Leader",
]);

const ORG_NAME_PATTERNS: RegExp[] = [
  /\bRevenue\s+NSW\b/gi,
  /\bNSW\s+Revenue\b/gi,
  /\bSaudi\s+Aramco\b/gi,
  /\bAramco\b/gi,
  /\bUniversity of Central Punjab\b/gi,
  /\bUNSW(?:\s+Sydney)?\b/gi,
  /\bManning Publications\b/gi,
];

function stripOrgMentions(text: string): string {
  let next = text;
  for (const pattern of ORG_NAME_PATTERNS) {
    next = next.replace(pattern, "");
  }
  return next
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,;:])/g, "$1")
    .replace(/,\s*,/g, ",")
    .replace(/\bat\s+,/gi, ",")
    .replace(/\bat\s*\./gi, ".")
    .trim();
}

function normalizeAboutConfig(raw: {
  displayName: string;
  title: string;
  bio: string;
  photoUrl: string;
  hiringBlurb: string;
  homeBlurb: string;
  credentials: Credential[];
}): AboutConfig {
  const title = stripOrgMentions(raw.title);
  const staleTitle = !title || STALE_ABOUT_TITLES.has(title);
  const credentials = raw.credentials
    .map((c) => ({
      label: stripOrgMentions(c.label),
      href: c.href,
    }))
    .filter(
      (c) =>
        c.label &&
        !/revenue\s*nsw|aramco|unsw|central\s*punjab|manning/i.test(c.label)
    );

  // API/admin values only. Never invent narrative from frontend seed copy.
  return {
    displayName: raw.displayName || "",
    title: staleTitle ? "" : title,
    bio: stripOrgMentions(raw.bio) || "",
    photoUrl: raw.photoUrl || "",
    hiringBlurb: stripOrgMentions(raw.hiringBlurb) || "",
    homeBlurb: stripOrgMentions(raw.homeBlurb) || "",
    credentials,
  };
}

/** Public about config from API only. Empty fields when unavailable. */
export async function getAboutConfig(): Promise<AboutConfig> {
  try {
    const res = await fetch(about_config_url, {
      next: { revalidate: 60, tags: ["about-config"] },
    });
    if (!res.ok) return { ...EMPTY_ABOUT };
    const data = await readJson<Record<string, unknown> | null>(res, null);
    if (!data) return { ...EMPTY_ABOUT };
    const credentials = Array.isArray(data.credentials)
      ? data.credentials
          .map((c: { label?: string; href?: string }) => ({
            label: String(c.label || ""),
            href: c.href ? String(c.href) : undefined,
          }))
          .filter((c: Credential) => c.label)
      : [];
    return normalizeAboutConfig({
      displayName: String(data.displayName || ""),
      title: String(data.title || ""),
      bio: String(data.bio || ""),
      photoUrl: String(data.photoUrl || ""),
      hiringBlurb: String(data.hiringBlurb || ""),
      homeBlurb: String(data.homeBlurb || ""),
      credentials,
    });
  } catch {
    return { ...EMPTY_ABOUT };
  }
}

export const CALENDLY_URL = "https://calendly.com/syedbaqirali/30min";

export const AMAZON_AUTHOR_URL =
  "https://www.amazon.com.au/stores/Syed-Baqir-Ali/author/B0G81DNV2T";

export const CREDENTIAL_LINKS = [
  { label: "GitHub", href: github_url },
  { label: "Cobu", href: cobu_url },
  { label: "Blox", href: blox_url },
  { label: "Amazon author", href: AMAZON_AUTHOR_URL },
] as const;
