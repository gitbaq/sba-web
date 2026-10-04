import { SubTopic } from "@/types/types";
import { isIndexable, postDate } from "@/lib/articles";
import { fetchPopularEssayIds } from "@/lib/essayEngagement";

function seriesKey(post: SubTopic): string {
  return (post.sbaTopicName || "").trim().toLowerCase();
}

function isPublic(post: SubTopic): boolean {
  return (
    (post.isPublished === true ||
      post.isPublished === "true" ||
      post.isPublished === "1") &&
    isIndexable(post)
  );
}

/**
 * Popular essays from other series.
 * Prefers view-ranked ids (BL-07), then curated ids, then one recent essay per series.
 */
export function pickPopularFromOtherSeries(
  posts: SubTopic[],
  opts: {
    currentId: number;
    currentSeries?: string;
    preferredIds?: number[];
    popularIds?: number[];
    limit?: number;
  }
): SubTopic[] {
  const limit = opts.limit ?? 3;
  const currentSeries = (opts.currentSeries || "").trim().toLowerCase();
  const pool = posts.filter(
    (p) =>
      isPublic(p) &&
      p.id !== opts.currentId &&
      seriesKey(p) !== currentSeries
  );
  if (!pool.length) return [];

  const byId = new Map(pool.map((p) => [p.id, p]));
  const picked: SubTopic[] = [];
  const usedSeries = new Set<string>();

  const orderedIds = [
    ...(opts.popularIds || []),
    ...(opts.preferredIds || []),
  ];

  for (const id of orderedIds) {
    const post = byId.get(id);
    if (!post) continue;
    const key = seriesKey(post) || `id-${post.id}`;
    if (usedSeries.has(key)) continue;
    picked.push(post);
    usedSeries.add(key);
    if (picked.length >= limit) return picked;
  }

  const rest = [...pool]
    .filter((p) => !picked.some((x) => x.id === p.id))
    .sort((a, b) => {
      const at = Date.parse(postDate(a) || "") || 0;
      const bt = Date.parse(postDate(b) || "") || 0;
      return bt - at;
    });

  for (const post of rest) {
    const key = seriesKey(post) || `id-${post.id}`;
    if (usedSeries.has(key)) continue;
    picked.push(post);
    usedSeries.add(key);
    if (picked.length >= limit) break;
  }

  return picked;
}

export async function loadPopularIds(): Promise<number[]> {
  return fetchPopularEssayIds(12);
}
