import {
  about_config_url,
  blox_url,
  cobu_url,
  github_url,
  work_projects_url,
} from "@/utils/endpoints/endpoints";
import {
  ABOUT_BIO,
  ABOUT_CREDENTIALS,
  ABOUT_HIRING_BLURB,
  ABOUT_HOME_BLURB,
  ABOUT_TITLE_LINE,
} from "@/lib/aboutContent";
import { COBU_STATUS_LINE } from "@/lib/copy";
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

/** Fallback when API is empty or unreachable (pre-seed / offline). */
export const FALLBACK_CASE_STUDIES: CaseStudy[] = [
  {
    slug: "cobu",
    title: "Cobu",
    tagline:
      "AI brainstorm buddy. Chat, explore ideas, and think with OpenAI or Anthropic.",
    href: "/work/cobu",
    externalUrl: cobu_url,
    mark: "/portfolio/cobu/mark.png",
    role: "Software engineer / subject-matter expert",
    timeline: "2025",
    result: COBU_STATUS_LINE,
    problem:
      "Most AI chat tools are either generic assistants or opaque enterprise stacks. People need a focused place to brainstorm, discuss, and pressure-test ideas, with a real choice of models and fresh web context when it matters.",
    approach: [
      "Center the product on brainstorming and natural conversation, not command menus.",
      "Let people choose OpenAI or Anthropic so the model fits the task.",
      "Integrate web search when answers need current information.",
      "Ship as a living product at codingburo.com on a modern Angular + Spring AI stack.",
    ],
    outcome: [
      "A free-to-join AI brainstorm buddy with multi-provider chat and web search.",
      "Clear product story: discuss ideas, keep context, share direction.",
      "Demonstrates end-to-end AI product delivery beyond demos and slides.",
    ],
    stack: ["Angular 20", "Spring AI", "OpenAI", "Anthropic"],
  },
  {
    slug: "blox",
    title: "Blox",
    tagline: "Productivity hub that helps you keep focus on the task.",
    href: "/work/blox",
    externalUrl: blox_url,
    mark: "/portfolio/blox/mark.png",
    role: "Software engineer / subject-matter expert",
    timeline: "2024",
    result: "A focused hub for goals, habits, and staying on the task at hand.",
    problem:
      "Most productivity tools reward complexity: long setups, rigid systems, and guilt when life gets busy. People need a calm place to set achievable goals, build habits, and see what actually won the week.",
    approach: [
      "Start from outcomes: habits and weekly wins, not feature checklists.",
      "Keep the first session short. Goals that feel achievable on day one.",
      "Surface progress visually so momentum is obvious without dashboards.",
      "Ship iteratively as a real product at blox.syedbaqirali.com.",
    ],
    outcome: [
      "A focused productivity hub spanning goals, habits, and weekly tracking.",
      "Clear product narrative: start small, track what matters, win the week.",
      "Living portfolio piece that demonstrates end-to-end product thinking.",
    ],
    stack: ["React", "Next.js", "Spring Boot", "MySQL", "Docker", "AWS EC2"],
  },
];

export const FALLBACK_ABOUT: AboutConfig = {
  displayName: "Syed Baqir Ali",
  title: ABOUT_TITLE_LINE,
  bio: ABOUT_BIO,
  photoUrl: "/sba-photo-2-small.png",
  hiringBlurb: ABOUT_HIRING_BLURB,
  homeBlurb: ABOUT_HOME_BLURB,
  credentials: ABOUT_CREDENTIALS,
};

function sanitizeVisitorCopy(text: string): string {
  return text.replace(
    /still maturing toward full capability/gi,
    "in active development"
  );
}

const SOFT_STACK = /product design|habit|ux|full-stack web|iterative|web application|ai product/i;

function resolveStack(
  _slug: string,
  raw: unknown,
  fallback?: string[]
): string[] {
  const fromApi = Array.isArray(raw) ? raw.map(String).filter(Boolean) : [];
  if (fromApi.length && !fromApi.some((s) => SOFT_STACK.test(s))) {
    return fromApi;
  }
  if (fallback?.length) return fallback;
  return fromApi;
}

function mapProject(raw: Record<string, unknown>): CaseStudy {
  const slug = String(raw.slug || "");
  const fallback = FALLBACK_CASE_STUDIES.find((c) => c.slug === slug);
  return {
    id: raw.id != null ? Number(raw.id) : undefined,
    slug,
    title: String(raw.title || fallback?.title || ""),
    tagline: String(raw.tagline || fallback?.tagline || ""),
    href: `/work/${slug}`,
    externalUrl: raw.externalUrl
      ? String(raw.externalUrl)
      : fallback?.externalUrl,
    mark: String(raw.mark || fallback?.mark || "/ai4.png"),
    role: String(raw.role || fallback?.role || ""),
    timeline: String(raw.timeline || fallback?.timeline || ""),
    result: sanitizeVisitorCopy(
      String(raw.result || fallback?.result || "")
    ),
    problem: String(raw.problem || fallback?.problem || ""),
    approach: Array.isArray(raw.approach)
      ? raw.approach.map(String)
      : fallback?.approach || [],
    outcome: Array.isArray(raw.outcome)
      ? raw.outcome.map(String)
      : fallback?.outcome || [],
    stack: resolveStack(slug, raw.stack, fallback?.stack),
    sortOrder: raw.sortOrder != null ? Number(raw.sortOrder) : undefined,
    isVisible:
      raw.isVisible === undefined ? true : Boolean(raw.isVisible),
  };
}

export async function getWorkProjects(): Promise<CaseStudy[]> {
  try {
    const res = await fetch(work_projects_url, {
      next: { revalidate: 60, tags: ["work-projects"] },
    });
    if (!res.ok) return FALLBACK_CASE_STUDIES;
    const data = await readJson<unknown[]>(res, []);
    const list = Array.isArray(data)
      ? data.map((raw) => mapProject(raw as Record<string, unknown>))
      : [];
    return list.length > 0 ? list : FALLBACK_CASE_STUDIES;
  } catch {
    return FALLBACK_CASE_STUDIES;
  }
}

export async function getWorkProject(
  slug: string
): Promise<CaseStudy | undefined> {
  try {
    const res = await fetch(`${work_projects_url}/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60, tags: ["work-projects"] },
    });
    if (res.ok) {
      const data = await readJson<Record<string, unknown> | null>(res, null);
      if (data) return mapProject(data);
    }
  } catch {
    /* fall through */
  }
  return FALLBACK_CASE_STUDIES.find((c) => c.slug === slug);
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

  return {
    displayName: raw.displayName || FALLBACK_ABOUT.displayName,
    title: staleTitle ? FALLBACK_ABOUT.title : title,
    bio: staleTitle
      ? FALLBACK_ABOUT.bio
      : stripOrgMentions(raw.bio) || FALLBACK_ABOUT.bio,
    photoUrl: raw.photoUrl || FALLBACK_ABOUT.photoUrl,
    hiringBlurb: staleTitle
      ? FALLBACK_ABOUT.hiringBlurb
      : stripOrgMentions(raw.hiringBlurb) || FALLBACK_ABOUT.hiringBlurb,
    homeBlurb: staleTitle
      ? FALLBACK_ABOUT.homeBlurb
      : stripOrgMentions(raw.homeBlurb) || FALLBACK_ABOUT.homeBlurb,
    credentials:
      staleTitle || credentials.length === 0
        ? FALLBACK_ABOUT.credentials
        : credentials,
  };
}

export async function getAboutConfig(): Promise<AboutConfig> {
  try {
    const res = await fetch(about_config_url, {
      next: { revalidate: 60, tags: ["about-config"] },
    });
    if (!res.ok) return FALLBACK_ABOUT;
    const data = await readJson<Record<string, unknown> | null>(res, null);
    if (!data) return FALLBACK_ABOUT;
    const credentials = Array.isArray(data.credentials)
      ? data.credentials
          .map((c: { label?: string; href?: string }) => ({
            label: String(c.label || ""),
            href: c.href ? String(c.href) : undefined,
          }))
          .filter((c: Credential) => c.label)
      : FALLBACK_ABOUT.credentials;
    return normalizeAboutConfig({
      displayName: (data.displayName as string) || FALLBACK_ABOUT.displayName,
      title: (data.title as string) || FALLBACK_ABOUT.title,
      bio: (data.bio as string) || FALLBACK_ABOUT.bio,
      photoUrl: (data.photoUrl as string) || FALLBACK_ABOUT.photoUrl,
      hiringBlurb: (data.hiringBlurb as string) || FALLBACK_ABOUT.hiringBlurb,
      homeBlurb: (data.homeBlurb as string) || FALLBACK_ABOUT.homeBlurb,
      credentials,
    });
  } catch {
    return FALLBACK_ABOUT;
  }
}

/** @deprecated Prefer getWorkProjects(); kept for static imports during migration. */
export const CASE_STUDIES = FALLBACK_CASE_STUDIES;

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return FALLBACK_CASE_STUDIES.find((c) => c.slug === slug);
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

/** @deprecated Prefer getAboutConfig().credentials */
export const CREDENTIALS: Credential[] = FALLBACK_ABOUT.credentials;
