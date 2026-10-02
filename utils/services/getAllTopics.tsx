import { topics_url } from "../endpoints/endpoints";
import { readJson } from "@/lib/http";

export async function getAllTopics() {
  const res = await fetch(`${topics_url}`);
  if (!res.ok) throw new Error("failed to fetch all Topics");
  const data = await readJson<unknown[]>(res, null);
  if (!Array.isArray(data)) throw new Error("failed to fetch all Topics");
  return data;
}
