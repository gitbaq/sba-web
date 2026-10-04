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

export function normalizeDashesInText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\u2014/g, ". ")
    .replace(/\u2013/g, "-")
    .replace(/&mdash;/gi, ". ")
    .replace(/&#8212;/g, ". ")
    .replace(/&#x2014;/gi, ". ")
    .replace(/&ndash;/gi, "-")
    .replace(/&#8211;/g, "-")
    .replace(/&#x2013;/gi, "-")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function extractTextFromHtml(html: string, maxLength = 160): string {
  const text = normalizeDashesInText(
    (html || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  ).substring(0, maxLength).trim();
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

const EMOJI_CLASS =
  "[\\u{1F000}-\\u{1FAFF}\\u{2600}-\\u{27BF}\\u{231A}-\\u{23FF}\\u{2B00}-\\u{2BFF}]";
const EMOJI_RUN_RE = new RegExp(
  `(\\s*)(?:${EMOJI_CLASS}|\\u{FE0F}|\\u{200D}|\\u{20E3})+(\\s*)`,
  "gu"
);

function emojiGap(_m: string, before: string, after: string): string {
  if (before && after) return " ";
  if (after) return after;
  return "";
}

/** Remove emoji from plain text and tidy the spacing they leave behind. */
export function stripEmojiFromText(text: string): string {
  if (!text) return "";
  return text.replace(EMOJI_RUN_RE, emojiGap).replace(/[ \t]{2,}/g, " ").trim();
}

/** Remove emoji (raw chars and numeric entities) from essay HTML. */
export function stripEmojiFromHtml(html: string): string {
  if (!html) return "";
  const withoutEntities = html.replace(
    /&#(?:x([0-9a-f]+)|(\d+));/gi,
    (full, hex, dec) => {
      const code = hex ? parseInt(hex, 16) : parseInt(dec, 10);
      const isEmoji =
        (code >= 0x1f000 && code <= 0x1faff) ||
        (code >= 0x2600 && code <= 0x27bf) ||
        (code >= 0x231a && code <= 0x23ff) ||
        (code >= 0x2b00 && code <= 0x2bff) ||
        code === 0xfe0f ||
        code === 0x200d ||
        code === 0x20e3;
      return isEmoji ? "" : full;
    }
  );
  return withoutEntities
    .replace(EMOJI_RUN_RE, emojiGap)
    .replace(/(<h[1-6]\b[^>]*>)\s+/gi, "$1")
    .replace(/\s+(<\/h[1-6]>)/gi, "$1");
}

function normalizeHeadingText(s: string): string {
  return stripEmojiFromText(s)
    .toLowerCase()
    .replace(/&[a-z0-9#]+;/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** True when two normalized strings are equal or nearly the same phrase. */
function isNearDuplicate(a: string, b: string): boolean {
  if (!a || !b) return false;
  if (a === b) return true;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  if (short.length >= 12 && long.includes(short) && short.length / long.length >= 0.75) {
    return true;
  }
  const ta = new Set(a.split(" "));
  const tb = new Set(b.split(" "));
  if (ta.size < 3 || tb.size < 3) return false;
  let shared = 0;
  ta.forEach((t) => {
    if (tb.has(t)) shared += 1;
  });
  return shared / (ta.size + tb.size - shared) >= 0.8;
}

/**
 * Page has one H1 (the title). Body headings are shifted so the shallowest
 * becomes H2, relative depth is kept, and levels never skip (max H4).
 * Drop the first body heading when it repeats the title or dek.
 */
export function demoteBodyHeadings(
  html: string,
  opts?: { title?: string; dek?: string }
): string {
  if (!html) return "";
  let out = html;

  const titleN = opts?.title ? normalizeHeadingText(opts.title) : "";
  const dekN = opts?.dek ? normalizeHeadingText(opts.dek) : "";
  if (titleN || dekN) {
    const first = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/i.exec(out);
    if (first) {
      const text = normalizeHeadingText(first[2].replace(/<[^>]*>/g, " "));
      if (
        text &&
        (isNearDuplicate(text, titleN) || isNearDuplicate(text, dekN))
      ) {
        out = out.slice(0, first.index) + out.slice(first.index + first[0].length);
      }
    }
  }

  const levels = [...out.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
  if (!levels.length) return out;
  const shift = 2 - Math.min(...levels);

  let prev = 1;
  let current = 2;
  return out.replace(/<(\/?)h([1-6])(\b[^>]*)>/gi, (_, slash, level, attrs) => {
    if (!slash) {
      const shifted = Number(level) + shift;
      current = Math.max(2, Math.min(shifted, prev + 1, 4));
      prev = current;
    }
    return `<${slash}h${current}${attrs}>`;
  });
}

/** Strip dead `#` anchors left from unpublished series list items. */
export function stripHashLinks(html: string): string {
  if (!html) return "";
  return html.replace(/<a\b[^>]*href=["']#["'][^>]*>([\s\S]*?)<\/a>/gi, "$1");
}

const PLANNED_PHRASE =
  "(?:(?:Articles|Posts|Essays|Topics)\\s+in\\s+this\\s+series|Coming\\s+soon|(?:Here\\s+are\\s+)?(?:the\\s+)?upcoming\\s+(?:articles|posts|essays|topics)(?:\\s+in\\s+(?:the|this)\\s+series)?)";
const PLANNED_HEADING_RE = new RegExp(
  `<(h[2-4])([^>]*)>\\s*(?:<[^>]+>\\s*)*${PLANNED_PHRASE}\\s*:?\\s*(?:<\\/[^>]+>\\s*)*<\\/\\1>`,
  "gi"
);
const PLANNED_PARAGRAPH_RE = new RegExp(
  `<p\\b[^>]*>\\s*(?:<(?:strong|b|em)>\\s*)?${PLANNED_PHRASE}\\s*[:.]?\\s*(?:<\\/(?:strong|b|em)>\\s*)?<\\/p>`,
  "gi"
);
const PLANNED_DETECT_RE = new RegExp(PLANNED_PHRASE, "i");

/** True when the HTML carries an upcoming or coming-soon series list. */
export function hasPlannedSeriesList(html: string): boolean {
  return PLANNED_DETECT_RE.test(html || "");
}

/** Label unfinished series lists as planned topics (no date implication). */
export function labelPlannedTopics(html: string): string {
  if (!html) return "";
  let out = html
    .replace(PLANNED_HEADING_RE, "<$1$2>Planned topics</$1>")
    .replace(PLANNED_PARAGRAPH_RE, "<h2>Planned topics</h2>");
  if (
    /Planned topics/i.test(out) &&
    !/no publish dates/i.test(out)
  ) {
    out = out.replace(
      /(<h[2-4]\b[^>]*>\s*Planned topics\s*<\/h[2-4]>)/i,
      "$1<p>These topics are planned. No publish dates are promised yet.</p>"
    );
  }
  return out;
}

/**
 * Remove Substack link-outs from essay HTML. Short paragraphs that exist only
 * to send readers to Substack are dropped. Other Substack links keep their text.
 */
export function stripSubstackLinkouts(html: string): string {
  if (!html) return "";
  const dropped = html.replace(/<p\b[^>]*>[\s\S]*?<\/p>/gi, (block) => {
    if (!/substack/i.test(block)) return block;
    const text = block.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const hasLink = /href=["'][^"']*substack\.com/i.test(block);
    const cta =
      /(originally\s+(?:published|posted)|also\s+(?:published|available)|cross-?posted|read\s+(?:this|it|more|the\s+full)|view\s+(?:this|it)|subscribe|sign\s*up|follow|thanks\s+for\s+reading|newsletter|on\s+substack|from\s+substack)/i;
    if (hasLink && text.length < 160) return "";
    if (text.length < 300 && cta.test(text) && /substack/i.test(text)) return "";
    if (text.length < 120 && /^[^.]*(substack)[^.]*\.?$/i.test(text)) return "";
    return block;
  });
  return dropped
    .replace(
      /<a\b[^>]*href=["'][^"']*substack\.com[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi,
      "$1"
    )
    .replace(/\s*(?:on|via|from)\s+Substack\b/gi, "")
    .replace(/\bSubstack\b/gi, "");
}

/** Replace em/en dashes (chars + HTML entities) so visitor copy stays ASCII-safe (P2-12). */
export function normalizeDashesInHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/\u2014/g, ". ")
    .replace(/\u2013/g, "-")
    .replace(/&mdash;/gi, ". ")
    .replace(/&#8212;/g, ". ")
    .replace(/&#x2014;/gi, ". ")
    .replace(/&ndash;/gi, "-")
    .replace(/&#8211;/g, "-")
    .replace(/&#x2013;/gi, "-");
}

/** Prepare essay HTML for render: cleanup, planned labels, demotion, TOC ids. */
export function prepareArticleHtml(
  html: string,
  opts?: {
    title?: string;
    dek?: string;
    essayId?: number;
    /** Series name; Blockchain series always gets planned-topics labels. */
    series?: string;
  }
): string {
  let out = stripHashLinks(stripEmojiFromHtml(html || ""));
  out = stripSubstackLinkouts(out);
  const isBlockchain = /^blockchain\b/i.test((opts?.series || "").trim());
  if (opts?.essayId === 0 || isBlockchain || hasPlannedSeriesList(out)) {
    out = labelPlannedTopics(out);
  }
  out = demoteBodyHeadings(out, { title: opts?.title, dek: opts?.dek });
  out = normalizeDashesInHtml(out);
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

const MIN_WORDS_TO_SPLIT = 400;
const SPLIT_TARGET = 0.4;
const SPLIT_MIN_TAIL_WORDS = 120;
const SPLIT_CONTAINERS = new Set([
  "blockquote",
  "ul",
  "ol",
  "table",
  "pre",
  "figure",
  "details",
]);

/**
 * Split HTML for the mid-article subscribe block. Cuts after a paragraph near
 * 40% of the words, preferring the end of a section. Never leaves a heading
 * stranded before the cut. Short essays are not split.
 */
export function splitHtmlAtMidpoint(html: string): [string, string] {
  if (!html) return ["", ""];
  const tokens = [...html.matchAll(/<(\/?)([a-z][a-z0-9]*)\b[^>]*>|([^<]+)/gi)];

  let depth = 0;
  let words = 0;
  let paraText = "";
  const candidates: { end: number; words: number; endsSection: boolean }[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t[3] !== undefined) {
      const n = t[3].trim() ? t[3].trim().split(/\s+/).length : 0;
      words += n;
      paraText += t[3];
      continue;
    }
    const closing = t[1] === "/";
    const tag = t[2].toLowerCase();
    if (SPLIT_CONTAINERS.has(tag)) {
      depth += closing ? -1 : 1;
      continue;
    }
    if (tag === "p" && !closing) {
      paraText = "";
      continue;
    }
    if (tag === "p" && closing && depth <= 0) {
      const text = paraText.replace(/\s+/g, " ").trim();
      if (text.split(" ").length < 8 || /[:]$/.test(text)) continue;
      const end = (t.index ?? 0) + t[0].length;
      const next = tokens.slice(i + 1).find((x) => x[3] === undefined || x[3].trim());
      const nextTag = next && next[3] === undefined ? next[2].toLowerCase() : "";
      if (nextTag === "li" || nextTag === "ul" || nextTag === "ol") continue;
      candidates.push({
        end,
        words,
        endsSection: /^h[1-6]$/.test(nextTag) && next?.[1] !== "/",
      });
    }
  }

  if (words < MIN_WORDS_TO_SPLIT || !candidates.length) return [html, ""];

  let best: { end: number; score: number } | null = null;
  for (const c of candidates) {
    if (words - c.words < SPLIT_MIN_TAIL_WORDS) continue;
    const ratio = c.words / words;
    if (ratio < 0.2 || ratio > 0.65) continue;
    const score = Math.abs(ratio - SPLIT_TARGET) - (c.endsSection ? 0.08 : 0);
    if (!best || score < best.score) best = { end: c.end, score };
  }
  if (!best) return [html, ""];
  return [html.slice(0, best.end), html.slice(best.end)];
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
