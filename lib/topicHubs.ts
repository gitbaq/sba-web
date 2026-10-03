import { SubTopic, Topic } from "@/types/types";
import { subtopics_url } from "@/utils/endpoints/endpoints";
import { readJson } from "@/lib/http";
import { isIndexable, postTags, slugify } from "@/lib/articles";
import { ESSAYS_CACHE_TAG } from "@/utils/services/getLatestSubtopics";

/** Attach series names from topics when the essays API omits sbaTopicName. */
export function enrichPostsWithSeries(
  posts: SubTopic[],
  topics: Topic[]
): SubTopic[] {
  const seriesByEssayId = new Map<number, string>();
  for (const topic of topics) {
    for (const essay of topic.subTopicList || []) {
      if (essay?.id != null) {
        seriesByEssayId.set(essay.id, topic.sbaTopicName);
      }
    }
  }
  return posts.map((post) => ({
    ...post,
    sbaTopicName:
      post.sbaTopicName || seriesByEssayId.get(post.id) || post.heading || "",
  }));
}

const MIN_HUB_COUNT = 3;

/** Server-side essay search via API (FULLTEXT with LIKE fallback). */
export async function searchEssays(query: string): Promise<SubTopic[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  try {
    const res = await fetch(
      `${subtopics_url}/search?query=${encodeURIComponent(q)}`,
      { next: { revalidate: 60, tags: [ESSAYS_CACHE_TAG] } }
    );
    if (!res.ok) return [];
    const data = await readJson<SubTopic[]>(res, []);
    return (Array.isArray(data) ? data : []).filter(isIndexable);
  } catch {
    return [];
  }
}

export function topicHubSlug(tag: string): string {
  return slugify(tag);
}

export function topicHubHref(tag: string): string {
  return `/writing/topics/${topicHubSlug(tag)}`;
}

/** Tags eligible for hub pages: at least MIN_HUB_COUNT indexable essays. */
export function tagHubCounts(posts: SubTopic[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const post of posts) {
    if (!isIndexable(post)) continue;
    const tags = new Set(postTags(post));
    // Series label also counts toward hubs when present.
    const series = (post.sbaTopicName || post.heading || "").trim().toLowerCase();
    if (series) tags.add(series);
    for (const tag of tags) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }
  return counts;
}

export function eligibleTopicHubs(posts: SubTopic[]): { tag: string; count: number }[] {
  const counts = tagHubCounts(posts);
  return [...counts.entries()]
    .filter(([, count]) => count >= MIN_HUB_COUNT)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function essaysForTopicHub(posts: SubTopic[], tag: string): SubTopic[] {
  const needle = tag.trim().toLowerCase();
  const slug = topicHubSlug(needle);
  return posts.filter((post) => {
    if (!isIndexable(post)) return false;
    const tags = postTags(post);
    if (tags.includes(needle) || tags.some((t) => topicHubSlug(t) === slug)) {
      return true;
    }
    const series = (post.sbaTopicName || post.heading || "").trim().toLowerCase();
    return series === needle || topicHubSlug(series) === slug;
  });
}

export { MIN_HUB_COUNT };
