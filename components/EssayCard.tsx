import Link from "next/link";
import { format } from "date-fns";
import { SubTopic } from "@/types/types";
import {
  articleHref,
  estimateReadingMinutes,
  extractTextFromHtml,
  postDate,
} from "@/lib/articles";
import { isNewPost } from "@/utils/services/getLatestSubtopics";
import { seriesStyle } from "@/lib/seriesColors";

type Props = {
  post: SubTopic;
  featured?: boolean;
  className?: string;
};

export default function EssayCard({
  post,
  featured = false,
  className = "",
}: Props) {
  const dateStr = postDate(post);
  const showNew = isNewPost(dateStr);
  const minutes = estimateReadingMinutes(post.content || "");
  const title = post.subHeading || post.heading;
  const dek =
    post.dek?.trim() ||
    extractTextFromHtml(post.content || "", featured ? 180 : 140)
      .replace(
        new RegExp(
          `^${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*[.….]?\\s*`,
          "i"
        ),
        ""
      )
      .trim();
  const topic = post.sbaTopicName || post.heading;

  return (
    <Link
      href={articleHref(post)}
      className={[
        featured ? "article-entry-featured group" : "article-entry group",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className='mb-2 flex flex-wrap items-center gap-x-3 gap-y-1'>
        {showNew && (
          <span className='text-[10px] font-bold uppercase tracking-wider text-spark'>
            New
          </span>
        )}
        {topic && topic !== title && (
          <span className='series-label' style={seriesStyle(topic)}>
            {topic}
          </span>
        )}
        <span className='text-xs tabular-nums text-muted-foreground'>
          {minutes} min read
          {dateStr ? ` · ${format(new Date(dateStr), "MMM d, yyyy")}` : ""}
        </span>
      </div>
      <h3
        className={`font-display font-bold tracking-tight text-foreground transition-colors group-hover:text-brand ${
          featured
            ? "mb-3 text-2xl leading-[1.15] sm:text-3xl md:text-[2rem]"
            : "mb-2 text-xl leading-snug sm:text-2xl"
        }`}
      >
        {title}
      </h3>
      {dek ? (
        <p
          className={`leading-relaxed text-muted-foreground ${
            featured
              ? "max-w-2xl text-base md:text-lg"
              : "max-w-2xl text-[0.95rem]"
          }`}
        >
          {dek}
          {!post.dek && dek.length >= (featured ? 180 : 140) ? "…" : ""}
        </p>
      ) : null}
    </Link>
  );
}
