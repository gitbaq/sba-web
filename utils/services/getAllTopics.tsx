import { topics_url } from "../endpoints/endpoints";
export async function getAllTopics() {
  const res = await fetch(`${topics_url}`);

  if (!res.ok) throw new Error("failed to fetch all Subtopics");

  return res.json();
}
