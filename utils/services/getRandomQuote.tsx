import { toast } from "sonner";
import { quotes_url } from "../endpoints/endpoints";

export async function getRandomQuote() {
  const res = await fetch(`${quotes_url}`);

  if (!res.ok) {
    toast("Failed to fetch Quote");
    throw new Error("failed to fetch Quote");
  }

  return res.json();
}
