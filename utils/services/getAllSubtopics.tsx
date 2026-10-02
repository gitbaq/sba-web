import { subtopics_url } from "../endpoints/endpoints";
import { readJson } from "@/lib/http";

export async function getAllSubtopics() {
  const res = await fetch(`${subtopics_url}`);
  if (!res.ok) throw new Error("failed to fetch all Subtopics");
  const data = await readJson<unknown>(res, null);
  if (data == null) throw new Error("failed to fetch all Subtopics");
  return data;
}

export async function getSearchSubtopics(query: string) {
  const fetchURL = `${subtopics_url}/search?query=${query}`;
  const res = await fetch(`${fetchURL}`);
  if (!res.ok) throw new Error("failed to fetch all Subtopics");
  const data = await readJson<unknown>(res, null);
  if (data == null) throw new Error("failed to fetch all Subtopics");
  return data;
}
