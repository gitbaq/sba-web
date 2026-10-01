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
  posts: SubTopic[];
  title?: string;
  className?: string;
  showViewAll?: boolean;
  /** First post gets a featured treatment */
  featured?: boolean;
};

function ArticleBlock({
  post,
  featured = false,
}: {
  post: SubTopic;
  featured?: boolean;
}) {
  const dateStr = postDate(post);
  const showNew = isNewPost(dateStr);
  const minutes = estimateReadingMinutes(post.content || "");
  // Prefer subHeading as dek when it differs from the card title; else excerpt.
  const title = post.subHeading || post.heading;
  const dekSource =
    post.subHeading && post.heading && post.subHeading !== post.heading
      ? ""
      : extractTextFromHtml(post.content || "", featured ? 180 : 140);
  // Avoid repeating the title inside the excerpt line.
  const excerpt = dekSource
    .replace(new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*[.…]?\\s*`, "i"), "")
    .trim();
  const topic = post.sbaTopicName || post.heading;

  return (
    <Link
      href={articleHref(post)}
      className={
        featured ? "article-entry-featured group" : "article-entry group"
      }
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
      {excerpt ? (
        <p
          className={`leading-relaxed text-muted-foreground ${
            featured ? "max-w-2xl text-base md:text-lg" : "max-w-2xl text-[0.95rem]"
          }`}
        >
          {excerpt}
          {excerpt.length >= (featured ? 180 : 140) ? "…" : ""}
        </p>
      ) : null}
    </Link>
  );
}

export default function LatestWriting({
  posts,
  title = "Latest writing",
  className = "",
  showViewAll = true,
  featured = false,
}: Props) {
  if (!posts.length) {
    return (
      <section className={`w-full ${className}`} aria-labelledby='latest-writing'>
        <p className='accent-label mb-3'>Writing</p>
        <h2
          id='latest-writing'
          className='display-title mb-4 text-3xl md:text-4xl'
        >
          {title}
        </h2>
        <p className='text-lg text-muted-foreground'>
          New essays as they publish.{" "}
          <Link
            href='/subscribe'
            className='text-brand underline-offset-4 hover:underline'
          >
            Subscribe
          </Link>{" "}
          to get them by email.
        </p>
      </section>
    );
  }

  const featuredPost = featured ? posts[0] : null;
  const list = featured ? posts.slice(1) : posts;

  return (
    <section className={`w-full ${className}`} aria-labelledby='latest-writing'>
      <div className='mb-6 flex flex-row items-end justify-between gap-4'>
        <div>
          <p className='accent-label mb-2'>Articles and essays</p>
          <h2
            id='latest-writing'
            className='display-title text-3xl text-foreground md:text-4xl'
          >
            {title}
          </h2>
        </div>
        {showViewAll && (
          <Link
            href='/writing'
            className='shrink-0 pb-1 text-sm font-semibold text-brand underline-offset-4 hover:underline'
          >
            View all
          </Link>
        )}
      </div>

      <div className='flex flex-col'>
        {featuredPost && <ArticleBlock post={featuredPost} featured />}
        <ul className='m-0 flex list-none flex-col p-0'>
          {list.map((post) => (
            <li key={post.id}>
              <ArticleBlock post={post} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
