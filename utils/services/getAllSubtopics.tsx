import { subtopics_url } from "../endpoints/endpoints";
export async function getAllSubtopics() {
  const res = await fetch(`${subtopics_url}`);

  if (!res.ok) throw new Error("failed to fetch all Subtopics");

  return res.json();
}

export async function getSearchSubtopics(query: string) {
  const fetchURL = `${subtopics_url}/search?query=${query}`;
  const res = await fetch(`${fetchURL}`);

  if (!res.ok) throw new Error("failed to fetch all Subtopics");

  return res.json();
}
