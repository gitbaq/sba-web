import { SubTopic } from "@/types/types";
import { subtopics_url } from "@/utils/endpoints/endpoints";
import { articleHref as hrefFromLib } from "@/lib/articles";

function sortByNewest(a: SubTopic, b: SubTopic) {
  const aTime = Date.parse(a.publishDate || a.updateDate || a.createDate || "");
  const bTime = Date.parse(b.publishDate || b.updateDate || b.createDate || "");
  return (Number.isFinite(bTime) ? bTime : 0) - (Number.isFinite(aTime) ? aTime : 0);
}

export async function getLatestSubtopics(limit = 5): Promise<SubTopic[]> {
  const all = await getAllSubtopicsSorted();
  return all.slice(0, limit);
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

export function isNewPost(dateStr: string | undefined, days = 14): boolean {
  if (!dateStr) return false;
  const t = Date.parse(dateStr);
  if (!Number.isFinite(t)) return false;
  const ageMs = Date.now() - t;
  return ageMs >= 0 && ageMs < days * 24 * 60 * 60 * 1000;
}

/** Prefer `/writing/{title}-{id}` */
export function articleHref(post: SubTopic): string {
  return hrefFromLib(post);
}

export function relatedPosts(current: SubTopic, all: SubTopic[], limit = 3): SubTopic[] {
  const sameTopic = all.filter(
    (p) =>
      p.id !== current.id &&
      (p.heading === current.heading ||
        (current.sbaTopicName && p.sbaTopicName === current.sbaTopicName))
  );
  const pool = sameTopic.length ? sameTopic : all.filter((p) => p.id !== current.id);
  return pool.slice(0, limit);
}
