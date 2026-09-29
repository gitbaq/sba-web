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

/** Canonical unique slug: `{title}-{id}` (API slugs are often duplicated/null). */
export function articleSlug(post: Pick<SubTopic, "id" | "slug" | "subHeading" | "heading">): string {
  const title = post.subHeading || post.heading || post.slug || "essay";
  return `${slugify(title)}-${post.id}`;
}

export function articleHref(post: Pick<SubTopic, "id" | "slug" | "subHeading" | "heading">): string {
  return `/writing/${articleSlug(post)}`;
}

/** Parse `/writing/[slug]` or legacy numeric id. */
export function parseArticleParam(param: string): { id: string } | null {
  if (!param) return null;
  if (/^\d+$/.test(param)) return { id: param };
  const match = param.match(/-(\d+)$/);
  if (match) return { id: match[1] };
  return null;
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

/** Inject id attributes into h1–h3 for TOC anchors (order must match extractToc). */
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
