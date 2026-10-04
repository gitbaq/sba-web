import Link from "next/link";
import { Topic, SubTopic } from "@/types/types";
import { articleHref, isIndexable } from "@/lib/articles";
import { seriesHref } from "@/utils/services/getTopics";

function isLive(s: SubTopic): boolean {
  const published =
    s.isPublished === true ||
    s.isPublished === "true" ||
    s.isPublished === "1";
  return published && isIndexable(s);
}

function sortSeries(list: SubTopic[]): SubTopic[] {
  return [...list].sort((a, b) => {
    const ao = a.seriesOrder ?? Number.MAX_SAFE_INTEGER;
    const bo = b.seriesOrder ?? Number.MAX_SAFE_INTEGER;
    if (ao !== bo) return ao - bo;
    const ad = Date.parse(a.publishDate || a.createDate || "") || 0;
    const bd = Date.parse(b.publishDate || b.createDate || "") || 0;
    return ad - bd;
  });
}

export default function SeriesNav({
  topic,
  currentId,
}: {
  topic: Topic | null | undefined;
  currentId: number;
}) {
  if (!topic?.subTopicList?.length) return null;

  // Only link live essays. Unpublished parts stay off the nav (P2-03).
  const ordered = sortSeries(topic.subTopicList.filter(isLive));
  if (ordered.length < 2) return null;

  const idx = ordered.findIndex((s) => s.id === currentId);
  const prev = idx > 0 ? ordered[idx - 1] : null;
  const next = idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null;

  return (
    <nav
      aria-labelledby='series-nav'
      className='rounded-lg border border-border bg-secondary/30 p-5'
    >
      <div className='flex flex-wrap items-baseline justify-between gap-2 border-b border-border/70 pb-4'>
        <h2 id='series-nav' className='text-sm font-semibold'>
          More in {topic.sbaTopicName}
        </h2>
        <Link
          href={seriesHref(topic)}
          className='text-xs font-semibold text-brand underline-offset-4 hover:underline'
        >
          Full list
        </Link>
      </div>
      <div className='mt-5 flex flex-col gap-5 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-8'>
        <div className='min-w-0 sm:max-w-[45%]'>
          <p className='mb-1 text-xs uppercase tracking-wide text-muted-foreground'>
            Previous
          </p>
          {prev ? (
            <Link
              href={articleHref(prev)}
              className='text-foreground underline-offset-2 hover:text-brand hover:underline'
            >
              {prev.subHeading || prev.heading}
            </Link>
          ) : (
            <span className='text-muted-foreground'>Start of series</span>
          )}
        </div>
        <div className='min-w-0 text-left sm:max-w-[45%] sm:text-right'>
          <p className='mb-1 text-xs uppercase tracking-wide text-muted-foreground'>
            Next
          </p>
          {next ? (
            <Link
              href={articleHref(next)}
              className='text-foreground underline-offset-2 hover:text-brand hover:underline'
            >
              {next.subHeading || next.heading}
            </Link>
          ) : (
            <span className='text-muted-foreground'>End of series</span>
          )}
        </div>
      </div>
    </nav>
  );
}
