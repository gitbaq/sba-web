import Link from "next/link";
import { Topic } from "@/types/types";
import { seriesHref } from "@/utils/services/getTopics";

type Props = {
  topic: Topic;
  description?: string;
  className?: string;
};

export default function SeriesCard({
  topic,
  description,
  className = "",
}: Props) {
  const count = topic.subTopicList?.length ?? 0;

  return (
    <Link
      href={seriesHref(topic)}
      className={[
        "flex flex-col gap-2 rounded-lg border border-border p-5 h-full transition-colors hover:border-brand/50 hover:bg-secondary/40",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className='flex items-start justify-between gap-3'>
        <span className='font-display text-xl font-semibold text-foreground tracking-tight'>
          {topic.sbaTopicName}
        </span>
        <span
          className='inline-flex shrink-0 items-center rounded-md border border-border/80 bg-secondary/60 px-2 py-0.5 text-xs font-semibold tabular-nums text-muted-foreground'
          aria-label={`${count} ${count === 1 ? "essay" : "essays"}`}
        >
          {count}
        </span>
      </div>
      {description ? (
        <span className='text-sm text-muted-foreground leading-relaxed'>
          {description}
        </span>
      ) : null}
    </Link>
  );
}
