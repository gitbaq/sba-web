import { Topic } from "@/types/types";
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

export function seriesSlug(topic: Pick<Topic, "id" | "sbaTopicName">): string {
  return `${slugify(topic.sbaTopicName || "series")}-${topic.id}`;
}

export function seriesHref(topic: Pick<Topic, "id" | "sbaTopicName">): string {
  return `/writing/series/${seriesSlug(topic)}`;
}

export function parseSeriesParam(param: string): { id: string } | null {
  if (!param) return null;
  if (/^\d+$/.test(param)) return { id: param };
  const match = param.match(/-(\d+)$/);
  if (match) return { id: match[1] };
  return null;
}

export function getTopicById(topics: Topic[], id: number | string): Topic | undefined {
  const n = typeof id === "string" ? Number(id) : id;
  return topics.find((t) => t.id === n);
}
