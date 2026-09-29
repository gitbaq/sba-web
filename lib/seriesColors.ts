/** Stable accent palette for series / topic labels (navy-friendly). */

export const SERIES_PALETTE = [
  { hue: 215, name: "navy" },
  { hue: 198, name: "steel" },
  { hue: 175, name: "teal" },
  { hue: 152, name: "forest" },
  { hue: 38, name: "gold" },
  { hue: 25, name: "copper" },
  { hue: 230, name: "indigo" },
  { hue: 190, name: "cyan" },
] as const;

function hashTopic(key: string): number {
  let h = 0;
  const s = key.trim().toLowerCase();
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function seriesHue(topicKey: string | null | undefined): number {
  const key = topicKey?.trim() || "default";
  const index = hashTopic(key) % SERIES_PALETTE.length;
  return SERIES_PALETTE[index].hue;
}

/** CSS variables for `.series-label` / `.series-chip` (light + dark via globals). */
export function seriesStyle(topicKey: string | null | undefined) {
  return { ["--series-h" as string]: String(seriesHue(topicKey)) };
}
