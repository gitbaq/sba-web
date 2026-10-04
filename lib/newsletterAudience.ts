import { newsletter_audience_url } from "@/utils/endpoints/endpoints";
import { readJson } from "@/lib/http";

export type PublicAudienceSignal = {
  mode: "hidden" | "growth" | "rounded";
  label: string | null;
  growthPercent7d?: number | null;
  roundedCount?: number | null;
};

/** Public-safe subscriber signal. Never invents numbers when the API is down. */
export async function getPublicAudienceSignal(): Promise<PublicAudienceSignal> {
  try {
    const res = await fetch(newsletter_audience_url, {
      next: { revalidate: 300, tags: ["newsletter-audience"] },
    });
    if (!res.ok) return { mode: "hidden", label: null };
    const data = await readJson<Record<string, unknown> | null>(res, null);
    if (!data) return { mode: "hidden", label: null };
    const mode =
      data.mode === "growth" || data.mode === "rounded" ? data.mode : "hidden";
    const label =
      typeof data.label === "string" && data.label.trim()
        ? data.label.trim()
        : null;
    if (mode === "hidden" || !label) return { mode: "hidden", label: null };
    return {
      mode,
      label,
      growthPercent7d:
        typeof data.growthPercent7d === "number" ? data.growthPercent7d : null,
      roundedCount:
        typeof data.roundedCount === "number" ? data.roundedCount : null,
    };
  } catch {
    return { mode: "hidden", label: null };
  }
}
