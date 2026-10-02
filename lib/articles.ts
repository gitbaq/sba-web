import { SubTopic } from "@/types/types";

export function slugify(text: string): string {
  const base = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || "essay";
}

/** Known catalog slugs after P1B bootstrap (id → canonical slug). */
export const ESSAY_SLUG_BY_ID: Record<number, string> = {
  0: "why-decentralization-matters",
  1: "supervised-learning-introduction",
  5: "attention-bert-gpt-transformers-nlp",
  14: "rust-safety-speed-concurrency",
  15: "physical-ai-robotics",
  16: "nlp-primer",
  18: "evolution-of-ai-collective-intelligence",
  19: "why-ai-is-on-everyones-mind",
  52: "multimodal-ai-text-speech-video",
};

/** Old public paths (`/writing/{title}-{id}`) → canonical slug. */
export const LEGACY_ARTICLE_PATHS: { source: string; slug: string }[] = [
  {
    source: "/writing/why-ai-is-on-everyones-mind-19",
    slug: "why-ai-is-on-everyones-mind",
  },
  {
    source: "/writing/why-decentralization-matters-0",
    slug: "why-decentralization-matters",
  },
  {
    source: "/writing/an-introduction-1",
    slug: "supervised-learning-introduction",
  },
  {
    source: "/writing/supervised-learning-an-introduction-1",
    slug: "supervised-learning-introduction",
  },
  {
    source: "/writing/attention-bert-gpt-and-transformers-in-nlp-5",
    slug: "attention-bert-gpt-transformers-nlp",
  },
  {
    source: "/writing/attention-bert-gpt-transformers-nlp-5",
    slug: "attention-bert-gpt-transformers-nlp",
  },
  {
    source: "/writing/rust-safety-speed-and-concurrency-14",
    slug: "rust-safety-speed-concurrency",
  },
  {
    source: "/writing/rust-safety-speed-concurrency-14",
    slug: "rust-safety-speed-concurrency",
  },
  {
    source: "/writing/physical-ai-and-robotics-15",
    slug: "physical-ai-robotics",
  },
  {
    source: "/writing/physical-ai-robotics-15",
    slug: "physical-ai-robotics",
  },
  {
    source: "/writing/nlp-primer-16",
    slug: "nlp-primer",
  },
  {
    source: "/writing/the-evolution-of-ai-and-collective-intelligence-18",
    slug: "evolution-of-ai-collective-intelligence",
  },
  {
    source: "/writing/evolution-of-ai-collective-intelligence-18",
    slug: "evolution-of-ai-collective-intelligence",
  },
  {
    source: "/writing/multimodal-ai-text-speech-and-video-52",
    slug: "multimodal-ai-text-speech-video",
  },
  {
    source: "/writing/multimodal-ai-text-speech-video-52",
    slug: "multimodal-ai-text-speech-video",
  },
];

/** Canonical slug: catalog map first, then API `slug`, else `{title}-{id}`. */
export function articleSlug(
  post: Pick<SubTopic, "id" | "slug" | "subHeading" | "heading">
): string {
  const mapped = ESSAY_SLUG_BY_ID[post.id];
  if (mapped) return mapped;
  if (post.slug && post.slug.trim()) {
    return post.slug.trim();
  }
  const title = post.subHeading || post.heading || "essay";
  return `${slugify(title)}-${post.id}`;
}

export function articleHref(
  post: Pick<SubTopic, "id" | "slug" | "subHeading" | "heading">
): string {
  return `/writing/${articleSlug(post)}`;
}

export type ArticleParam =
  | { kind: "id"; id: string }
  | { kind: "slug"; slug: string };

/** Parse `/writing/[param]`: trailing `-{id}`, bare id, or clean slug. */
export function parseArticleParam(param: string): ArticleParam | null {
  if (!param) return null;
  if (/^\d+$/.test(param)) return { kind: "id", id: param };
  const match = param.match(/-(\d+)$/);
  if (match) return { kind: "id", id: match[1] };
  return { kind: "slug", slug: param };
}

export function extractTextFromHtml(html: string, maxLength = 160): string {
  const text = (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, maxLength)
    .trim();
  return text || "Research writing by Syed Baqir Ali";
}

export function estimateReadingMinutes(html: string): number {
  const text = (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.round(words / 200));
}

export type TocItem = { id: string; text: string; level: 1 | 2 | 3 | 4 };

export function extractToc(html: string): TocItem[] {
  const items: TocItem[] = [];
  const used = new Map<string, number>();
  const re = /<h([1-4])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    const level = Number(match[1]) as 1 | 2 | 3 | 4;
    const text = match[2].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    if (!text) continue;
    let id = slugify(text);
    const count = used.get(id) ?? 0;
    used.set(id, count + 1);
    if (count > 0) id = `${id}-${count + 1}`;
    items.push({ id, text, level });
  }
  return items;
}

/** Inject id attributes into h1-h4 for TOC anchors (order must match extractToc). */
export function injectHeadingIds(html: string): string {
  const toc = extractToc(html);
  let i = 0;
  return html.replace(/<h([1-4])([^>]*)>/gi, (full, level, attrs) => {
    const item = toc[i++];
    if (!item) return full;
    if (/\sid=/i.test(attrs)) return full;
    return `<h${level}${attrs} id="${item.id}">`;
  });
}

/**
 * Page has one H1 (the title). Demote body H1→H2, H2→H3, H3→H4.
 * Drop a leading body heading that repeats the title or dek.
 */
export function demoteBodyHeadings(
  html: string,
  opts?: { title?: string; dek?: string }
): string {
  if (!html) return "";
  let out = html.replace(/<h([1-3])(\b[^>]*)>/gi, (_, level, attrs) => {
    const next = Math.min(Number(level) + 1, 4);
    return `<h${next}${attrs}>`;
  });
  out = out.replace(/<\/h([1-3])>/gi, (_, level) => {
    const next = Math.min(Number(level) + 1, 4);
    return `</h${next}>`;
  });

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  const titleN = opts?.title ? normalize(opts.title) : "";
  const dekN = opts?.dek ? normalize(opts.dek) : "";
  if (titleN || dekN) {
    out = out.replace(
      /^\s*<h([2-4])\b[^>]*>([\s\S]*?)<\/h\1>/i,
      (full, _level, inner) => {
        const text = normalize(String(inner).replace(/<[^>]*>/g, " "));
        if (text && (text === titleN || text === dekN)) return "";
        return full;
      }
    );
  }
  return out;
}

/** Strip dead `#` anchors left from unpublished series list items. */
export function stripHashLinks(html: string): string {
  if (!html) return "";
  return html.replace(/<a\b[^>]*href=["']#["'][^>]*>([\s\S]*?)<\/a>/gi, "$1");
}

/** Label Blockchain 101 unfinished list as planned topics (no date implication). */
export function labelPlannedTopics(html: string): string {
  if (!html) return "";
  return html
    .replace(
      /<(h[2-4])([^>]*)>(\s*(?:Articles|Posts|Essays|Topics)\s+in\s+this\s+series\s*)<\/\1>/gi,
      "<$1$2>Planned topics</$1>"
    )
    .replace(
      /<(h[2-4])([^>]*)>(\s*Coming\s+soon\s*)<\/\1>/gi,
      "<$1$2>Planned topics</$1>"
    );
}

/** Prepare essay HTML for render: links, demotion, TOC ids. */
export function prepareArticleHtml(
  html: string,
  opts?: { title?: string; dek?: string; essayId?: number }
): string {
  let out = stripHashLinks(html || "");
  if (opts?.essayId === 0) {
    out = labelPlannedTopics(out);
  }
  out = demoteBodyHeadings(out, { title: opts?.title, dek: opts?.dek });
  return injectHeadingIds(out);
}

export function postDate(post: SubTopic): string {
  return post.publishDate || post.updateDate || post.createDate || "";
}

/**
 * Prefer publish date when updateDate looks like a catalog backfill
 * (same stamp on many essays on 2026-10-02) rather than a real edit.
 */
export function articleModifiedDate(
  post: Pick<SubTopic, "publishDate" | "updateDate" | "createDate">
): string {
  const published = post.publishDate || post.createDate || "";
  const updated = post.updateDate || "";
  if (!updated) return published;
  if (!published) return updated;
  if (updated.startsWith("2026-10-02") && !published.startsWith("2026-10-02")) {
    return published;
  }
  const pubDay = new Date(published).toDateString();
  const updDay = new Date(updated).toDateString();
  if (pubDay === updDay) return published;
  return updated;
}

export function shouldShowUpdated(
  post: Pick<SubTopic, "publishDate" | "updateDate" | "createDate">
): boolean {
  const published = post.publishDate || post.createDate || "";
  const modified = articleModifiedDate(post);
  if (!published || !modified) return false;
  return (
    new Date(modified).toDateString() !== new Date(published).toDateString()
  );
}

/** Split HTML near ~40% of H2 sections for mid-article subscribe. */
export function splitHtmlAtMidpoint(html: string): [string, string] {
  if (!html) return ["", ""];
  const re = /<h2\b[^>]*>/gi;
  const matches = [...html.matchAll(re)];
  if (matches.length < 2) return [html, ""];
  const cutIndex = Math.max(1, Math.floor(matches.length * 0.4));
  const match = matches[cutIndex];
  const at = match.index ?? -1;
  if (at <= 0) return [html, ""];
  return [html.slice(0, at), html.slice(at)];
}

/** Stub essay ids excluded from sitemap/index until full text lands. */
export const NOINDEX_ESSAY_IDS = new Set<number>([19]);

export function isIndexable(post: Pick<SubTopic, "id" | "noindex">): boolean {
  if (NOINDEX_ESSAY_IDS.has(post.id)) return false;
  return post.noindex !== true && post.noindex !== "true";
}

export function postTags(post: Pick<SubTopic, "tags">): string[] {
  if (!post.tags) return [];
  return post.tags
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}
