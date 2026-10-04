import {
  essay_clap_url,
  essay_popular_url,
  essay_stats_url,
  essay_view_url,
} from "@/utils/endpoints/endpoints";
import { readJson } from "@/lib/http";

export type EssayStats = {
  essayId: number;
  viewCount: number;
  clapCount: number;
  clapped: boolean;
};

export async function fetchEssayStats(
  essayId: number
): Promise<EssayStats | null> {
  try {
    const res = await fetch(essay_stats_url(essayId), { cache: "no-store" });
    if (!res.ok) return null;
    return await readJson<EssayStats | null>(res, null);
  } catch {
    return null;
  }
}

export async function recordEssayView(
  essayId: number
): Promise<EssayStats | null> {
  try {
    const res = await fetch(essay_view_url(essayId), { method: "POST" });
    if (!res.ok) return null;
    return await readJson<EssayStats | null>(res, null);
  } catch {
    return null;
  }
}

export async function clapEssay(essayId: number): Promise<EssayStats | null> {
  try {
    const res = await fetch(essay_clap_url(essayId), { method: "POST" });
    if (!res.ok) return null;
    return await readJson<EssayStats | null>(res, null);
  } catch {
    return null;
  }
}

export async function fetchPopularEssayIds(limit = 12): Promise<number[]> {
  try {
    const res = await fetch(`${essay_popular_url}?limit=${limit}`, {
      next: { revalidate: 120, tags: ["essay-popular"] },
    });
    if (!res.ok) return [];
    const data = await readJson<EssayStats[]>(res, []);
    return (Array.isArray(data) ? data : [])
      .map((row) => Number(row.essayId))
      .filter((id) => Number.isFinite(id) && id > 0);
  } catch {
    return [];
  }
}
