import { SubTopic } from "@/types/types";
import { home_config_url } from "@/utils/endpoints/endpoints";
import { readJson } from "@/lib/http";

export type HomePageConfig = {
  featuredEssayId: number | null;
  startHereEssayIds: number[];
};

const EMPTY_HOME_CONFIG: HomePageConfig = {
  featuredEssayId: null,
  startHereEssayIds: [],
};

export async function getHomePageConfig(): Promise<HomePageConfig> {
  try {
    const res = await fetch(home_config_url, {
      next: { revalidate: 60, tags: ["home-config"] },
    });
    if (!res.ok) return { ...EMPTY_HOME_CONFIG };
    const data = await readJson<Record<string, unknown> | null>(res, null);
    if (!data) return { ...EMPTY_HOME_CONFIG };
    const ids = Array.isArray(data?.startHereEssayIds)
      ? data.startHereEssayIds
          .map((n: unknown) => Number(n))
          .filter((n: number) => Number.isFinite(n) && n > 0)
          .slice(0, 3)
      : [];
    const featured =
      data?.featuredEssayId != null && Number(data.featuredEssayId) > 0
        ? Number(data.featuredEssayId)
        : null;
    return {
      featuredEssayId: featured,
      startHereEssayIds: ids,
    };
  } catch {
    return { ...EMPTY_HOME_CONFIG };
  }
}

/** Only essays explicitly configured by id. No chronological filler. */
export function pickEssaysByIds(
  posts: SubTopic[],
  ids: number[],
  limit = 3
): SubTopic[] {
  if (!ids.length) return [];
  const byId = new Map(posts.map((p) => [p.id, p]));
  const picked: SubTopic[] = [];
  for (const id of ids) {
    const post = byId.get(id);
    if (post) picked.push(post);
    if (picked.length >= limit) break;
  }
  return picked;
}

/**
 * Build Latest list: optional boosted essay first, then chronological fillers.
 * Never include ids in `excludeIds` (P2-09: no overlap with Start here).
 */
export function buildLatestWithBoost(
  chronological: SubTopic[],
  allPublished: SubTopic[],
  featuredEssayId: number | null,
  limit = 3,
  excludeIds: number[] = []
): SubTopic[] {
  const exclude = new Set(excludeIds);
  const pool = chronological.filter((p) => !exclude.has(p.id));
  if (featuredEssayId && !exclude.has(featuredEssayId)) {
    const boosted = allPublished.find((p) => p.id === featuredEssayId);
    if (boosted) {
      const rest = pool.filter((p) => p.id !== featuredEssayId);
      return [boosted, ...rest].slice(0, limit);
    }
  }
  return pool.slice(0, limit);
}
