import { Topic } from "@/types/types";
import { topics_url } from "../endpoints/endpoints";
import { readJson } from "@/lib/http";

export async function getAllTopics(): Promise<Topic[]> {
  const res = await fetch(`${topics_url}`);
  if (!res.ok) throw new Error("failed to fetch all Topics");
  const data = await readJson<Topic[] | null>(res, null);
  if (!Array.isArray(data)) throw new Error("failed to fetch all Topics");
  return data;
}
