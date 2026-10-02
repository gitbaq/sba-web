import Link from "next/link";
import { Topic } from "@/types/types";
import { seriesHref } from "@/utils/services/getTopics";
import { seriesStyle } from "@/lib/seriesColors";

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
  const blurb =
    description ||
    `${count} ${count === 1 ? "essay" : "essays"} in this series.`;

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
      <span
        className='series-label w-fit'
        style={seriesStyle(topic.sbaTopicName)}
      >
        Series
      </span>
      <span className='font-display text-xl font-semibold text-foreground tracking-tight'>
        {topic.sbaTopicName}
      </span>
      <span className='text-sm text-muted-foreground leading-relaxed'>
        {blurb}
      </span>
      <span className='mt-auto pt-2 text-xs tabular-nums text-muted-foreground'>
        {count} {count === 1 ? "essay" : "essays"}
      </span>
    </Link>
  );
}
