import Link from "next/link";
import { Topic } from "@/types/types";
import { articleHref } from "@/lib/articles";
import { seriesHref } from "@/utils/services/getTopics";

export default function SeriesNav({
  topic,
  currentId,
}: {
  topic: Topic | null | undefined;
  currentId: number;
}) {
  if (!topic?.subTopicList?.length) return null;
  if (topic.subTopicList.length < 2) return null;

  const siblings = topic.subTopicList.filter((s) => s.id !== currentId);

  return (
    <nav
      aria-labelledby='series-nav'
      className='rounded-lg border border-border bg-secondary/30 p-4 mb-8'
    >
      <div className='flex flex-wrap items-baseline justify-between gap-2 mb-2'>
        <h2 id='series-nav' className='text-sm font-semibold'>
          Series: {topic.sbaTopicName}
        </h2>
        <Link
          href={seriesHref(topic)}
          className='text-xs text-brand underline-offset-4 hover:underline'
        >
          View series
        </Link>
      </div>
      <p className='text-xs text-muted-foreground mb-3'>
        {topic.subTopicList.length} essays in this series
      </p>
      {siblings.length > 0 && (
        <ul className='flex flex-col gap-1.5 list-none p-0 m-0 text-sm'>
          {siblings.slice(0, 4).map((s) => (
            <li key={s.id}>
              <Link
                href={articleHref(s)}
                className='text-muted-foreground hover:text-brand underline-offset-2 hover:underline'
              >
                {s.subHeading || s.heading}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
