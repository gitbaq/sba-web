import { quotes_url } from "../endpoints/endpoints";
import type { RandomQuote } from "@/types/types";
import { readJson } from "@/lib/http";

export async function getRandomQuote(): Promise<RandomQuote | null> {
  try {
    const res = await fetch(quotes_url, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await readJson<RandomQuote | null>(res, null);
    if (!data?.quoteText) return null;
    return data;
  } catch {
    return null;
  }
}
