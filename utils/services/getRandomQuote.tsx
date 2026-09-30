import { quotes_url } from "../endpoints/endpoints";
import type { RandomQuote } from "@/types/types";

export async function getRandomQuote(): Promise<RandomQuote | null> {
  try {
    const res = await fetch(quotes_url, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as RandomQuote;
    if (!data?.quoteText) return null;
    return data;
  } catch {
    return null;
  }
}
