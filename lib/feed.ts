import { SubTopic } from "@/types/types";
import { postDate } from "@/lib/articles";
import { isNewPost } from "@/utils/services/getLatestSubtopics";

/** Posts published/updated within the last `days` (default 7). */
export function postsThisWeek(posts: SubTopic[], days = 7): SubTopic[] {
  return posts.filter((p) => isNewPost(postDate(p), days));
}
