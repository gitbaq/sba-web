import { notFound, permanentRedirect } from "next/navigation";
import { articleHref } from "@/lib/articles";
import { getSubTopicById } from "@/utils/services/getLatestSubtopics";

type Params = Promise<{ topicId: string }>;

/** Legacy `/learning/[id]` → canonical `/writing/{slug}-{id}` */
export default async function LearningArticleRedirect({
  params,
}: {
  params: Params;
}) {
  const { topicId } = await params;
  const post = await getSubTopicById(topicId);
  if (!post) notFound();
  permanentRedirect(articleHref(post));
}
