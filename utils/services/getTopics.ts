import { SubTopic, Topic } from "@/types/types";
import { topics_url } from "@/utils/endpoints/endpoints";
import { slugify } from "@/lib/articles";
import { readJson } from "@/lib/http";

export async function getAllTopicsSafe(): Promise<Topic[]> {
  try {
    const res = await fetch(topics_url, {
      next: { revalidate: 60, tags: ["essays"] },
    });
    if (!res.ok) return [];
    const data = await readJson<Topic[]>(res, []);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** Canonical series slug: the slugified name only (for example `deep-learning`). */
export function seriesSlug(topic: Pick<Topic, "id" | "sbaTopicName">): string {
  return slugify(topic.sbaTopicName || "series");
}

export function seriesHref(topic: Pick<Topic, "id" | "sbaTopicName">): string {
  return `/writing/series/${seriesSlug(topic)}`;
}

/**
 * Parse the legacy numeric forms: bare `12` or `deep-learning-12`.
 * Clean name slugs are resolved against topics by `findSeriesTopic`.
 */
export function parseSeriesParam(param: string): { id: string } | null {
  if (!param) return null;
  if (/^\d+$/.test(param)) return { id: param };
  const match = param.match(/-(\d+)$/);
  if (match) return { id: match[1] };
  return null;
}

/**
 * Resolve a `/writing/series/[topicSlug]` param. A clean name slug wins first
 * (so "blockchain-101" is not read as id 101), then `name-id` and bare id.
 */
export function findSeriesTopic(topics: Topic[], param: string): Topic | undefined {
  if (!param) return undefined;
  const bySlug = topics.find((t) => seriesSlug(t) === param);
  if (bySlug) return bySlug;
  const parsed = parseSeriesParam(param);
  return parsed ? getTopicById(topics, parsed.id) : undefined;
}

/** Series topic for an essay: membership first, then topicId, then name. */
export function findTopicForPost(
  topics: Topic[],
  post: Pick<SubTopic, "id" | "topicId" | "sbaTopicName">
): Topic | undefined {
  return (
    topics.find((t) => t.subTopicList?.some((s) => s.id === post.id)) ||
    (post.topicId != null ? getTopicById(topics, post.topicId) : undefined) ||
    (post.sbaTopicName
      ? topics.find((t) => t.sbaTopicName === post.sbaTopicName)
      : undefined)
  );
}

export function getTopicById(topics: Topic[], id: number | string): Topic | undefined {
  const n = typeof id === "string" ? Number(id) : id;
  return topics.find((t) => t.id === n);
}
