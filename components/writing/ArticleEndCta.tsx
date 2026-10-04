import ArticleEndActions from "@/components/writing/ArticleEndActions";

/** End-of-essay subscribe / self-send. Series navigation lives in SeriesNav below. */
export default function ArticleEndCta({ essayId }: { essayId?: number }) {
  return <ArticleEndActions essayId={essayId} />;
}
