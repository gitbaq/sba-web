import { SubTopic } from "@/types/types";
import { subtopics_url } from "@/utils/endpoints/endpoints";
import {
  articleHref as hrefFromLib,
  ESSAY_SLUG_BY_ID,
  isIndexable,
  parseArticleParam,
  postDate,
  postTags,
  type ArticleParam,
} from "@/lib/articles";

function sortByNewest(a: SubTopic, b: SubTopic) {
  const aTime = Date.parse(a.publishDate || a.updateDate || a.createDate || "");
  const bTime = Date.parse(b.publishDate || b.updateDate || b.createDate || "");
  return (Number.isFinite(bTime) ? bTime : 0) - (Number.isFinite(aTime) ? aTime : 0);
}

export async function getLatestSubtopics(limit = 5): Promise<SubTopic[]> {
  const all = await getAllSubtopicsSorted();
  return all.filter(isIndexable).slice(0, limit);
}

export async function getAllSubtopicsSorted(): Promise<SubTopic[]> {
  try {
    const res = await fetch(subtopics_url, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data: SubTopic[] = await res.json();
    if (!Array.isArray(data)) return [];
    return [...data].sort(sortByNewest);
  } catch {
    return [];
  }
}

export async function getSubTopicById(subId: string): Promise<SubTopic | null> {
  if (!subId) return null;
  try {
    const res = await fetch(`${subtopics_url}/s/${subId}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getSubTopicBySlug(slug: string): Promise<SubTopic | null> {
  if (!slug) return null;
  try {
    const res = await fetch(`${subtopics_url}/slug/${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data && data.id != null ? data : null;
  } catch {
    return null;
  }
}

export async function resolveArticle(
  param: string
): Promise<SubTopic | null> {
  const parsed = parseArticleParam(param);
  if (!parsed) return null;
  return resolveArticleParam(parsed);
}

export async function resolveArticleParam(
  parsed: ArticleParam
): Promise<SubTopic | null> {
  if (parsed.kind === "id") {
    return getSubTopicById(parsed.id);
  }
  const bySlug = await getSubTopicBySlug(parsed.slug);
  if (bySlug) return bySlug;

  // Catalog reverse lookup works before API slug endpoint / bootstrap.
  const knownId = Object.entries(ESSAY_SLUG_BY_ID).find(
    ([, slug]) => slug === parsed.slug
  )?.[0];
  if (knownId) {
    const byId = await getSubTopicById(knownId);
    if (byId) return byId;
  }

  const all = await getAllSubtopicsSorted();
  return (
    all.find((p) => p.slug === parsed.slug) ||
    all.find((p) => p.legacySlug === parsed.slug) ||
    null
  );
}

export function isNewPost(dateStr: string | undefined, days = 14): boolean {
  if (!dateStr) return false;
  const t = Date.parse(dateStr);
  if (!Number.isFinite(t)) return false;
  const ageMs = Date.now() - t;
  return ageMs >= 0 && ageMs < days * 24 * 60 * 60 * 1000;
}

export function articleHref(post: SubTopic): string {
  return hrefFromLib(post);
}

/** Rank by shared series (topicId), then shared tags, then recency. */
export function relatedPosts(
  current: SubTopic,
  all: SubTopic[],
  limit = 3
): SubTopic[] {
  const currentTags = new Set(postTags(current));
  const scored = all
    .filter((p) => p.id !== current.id && isIndexable(p))
    .map((p) => {
      let score = 0;
      if (current.topicId != null && p.topicId === current.topicId) score += 100;
      else if (
        current.sbaTopicName &&
        p.sbaTopicName &&
        p.sbaTopicName === current.sbaTopicName
      ) {
        score += 80;
      } else if (p.heading && p.heading === current.heading) {
        score += 60;
      }
      const overlap = postTags(p).filter((t) => currentTags.has(t)).length;
      score += overlap * 10;
      const t = Date.parse(postDate(p));
      const recency = Number.isFinite(t) ? t / 1e13 : 0;
      return { p, score: score + recency };
    })
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.p);
}
