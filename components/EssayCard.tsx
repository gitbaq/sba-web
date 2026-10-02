import Link from "next/link";
import Image from "next/image";
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

function coverSrc(post: SubTopic): string {
  const src = (post.ogImageUrl || post.imageUrl || "").trim();
  return src || "/ai4.png";
}

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
  const image = coverSrc(post);

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
      <div
        className={
          featured
            ? "flex flex-col gap-5 md:flex-row md:items-stretch md:gap-7"
            : "flex flex-row items-start gap-4 sm:gap-5"
        }
      >
        <div className='min-w-0 flex-1 order-2 md:order-1'>
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
                  : "max-w-xl text-[0.95rem] line-clamp-3"
              }`}
            >
              {dek}
              {!post.dek && dek.length >= (featured ? 180 : 140) ? "…" : ""}
            </p>
          ) : null}
        </div>

        <div
          className={
            featured
              ? "relative order-1 md:order-2 aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-secondary ring-1 ring-border/70 md:aspect-auto md:h-auto md:w-[44%] md:min-h-[11.5rem]"
              : "relative aspect-[4/3] w-[5.5rem] shrink-0 overflow-hidden rounded-lg bg-secondary ring-1 ring-border/70 sm:w-28 md:w-36"
          }
          aria-hidden
        >
          <Image
            src={image}
            alt=''
            fill
            className='object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none'
            sizes={
              featured
                ? "(max-width: 768px) 100vw, 420px"
                : "(max-width: 640px) 88px, (max-width: 768px) 112px, 144px"
            }
          />
        </div>
      </div>
    </Link>
  );
}
