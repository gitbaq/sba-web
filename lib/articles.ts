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

export type TocItem = { id: string; text: string; level: 1 | 2 | 3 };

export function extractToc(html: string): TocItem[] {
  const items: TocItem[] = [];
  const used = new Map<string, number>();
  const re = /<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    const level = Number(match[1]) as 1 | 2 | 3;
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

/** Inject id attributes into h1-h3 for TOC anchors (order must match extractToc). */
export function injectHeadingIds(html: string): string {
  const toc = extractToc(html);
  let i = 0;
  return html.replace(/<h([1-3])([^>]*)>/gi, (full, level, attrs) => {
    const item = toc[i++];
    if (!item) return full;
    if (/\sid=/i.test(attrs)) return full;
    return `<h${level}${attrs} id="${item.id}">`;
  });
}

export function postDate(post: SubTopic): string {
  return post.publishDate || post.updateDate || post.createDate || "";
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
