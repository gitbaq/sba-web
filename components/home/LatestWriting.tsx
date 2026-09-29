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
  const excerpt = extractTextFromHtml(post.content || "", featured ? 220 : 160);
  const title = post.subHeading || post.heading;
  const topic = post.sbaTopicName || post.heading;

  return (
    <Link
      href={articleHref(post)}
      className={
        featured
          ? "article-entry-featured group"
          : "article-entry group"
      }
    >
      <div className='flex flex-wrap items-center gap-x-3 gap-y-1 mb-2'>
        {showNew && (
          <span className='text-[10px] font-bold uppercase tracking-wider text-spark'>
            New
          </span>
        )}
        {topic && (
          <span className='series-label' style={seriesStyle(topic)}>
            {topic}
          </span>
        )}
        <span className='text-xs text-muted-foreground tabular-nums'>
          {minutes} min read
          {dateStr
            ? ` · ${format(new Date(dateStr), "MMM d, yyyy")}`
            : ""}
        </span>
      </div>
      <h3
        className={`font-display font-bold tracking-tight text-foreground group-hover:text-brand transition-colors ${
          featured
            ? "text-2xl sm:text-3xl md:text-[2rem] leading-[1.15] mb-3"
            : "text-xl sm:text-2xl leading-snug mb-2"
        }`}
      >
        {title}
      </h3>
      <p
        className={`text-muted-foreground leading-relaxed ${
          featured ? "text-base md:text-lg max-w-2xl" : "text-[0.95rem] max-w-2xl"
        }`}
      >
        {excerpt}
        {excerpt.length >= (featured ? 220 : 160) ? "…" : ""}
      </p>
      <span className='inline-flex mt-3 text-sm font-semibold text-brand underline-offset-4 group-hover:underline'>
        Read more
      </span>
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
          className='display-title text-3xl md:text-4xl mb-4'
        >
          {title}
        </h2>
        <p className='text-muted-foreground text-lg'>
          New essays land here weekly.{" "}
          <Link
            href='/subscribe'
            className='text-brand underline-offset-4 hover:underline'
          >
            Subscribe
          </Link>{" "}
          to get them first.
        </p>
      </section>
    );
  }

  const featuredPost = featured ? posts[0] : null;
  const list = featured ? posts.slice(1) : posts;

  return (
    <section className={`w-full ${className}`} aria-labelledby='latest-writing'>
      <div className='flex flex-row items-end justify-between gap-4 mb-6'>
        <div>
          <p className='accent-label mb-2'>Articles &amp; essays</p>
          <h2
            id='latest-writing'
            className='display-title text-3xl md:text-4xl text-foreground'
          >
            {title}
          </h2>
        </div>
        {showViewAll && (
          <Link
            href='/writing'
            className='text-sm font-semibold text-brand underline-offset-4 hover:underline shrink-0 pb-1'
          >
            View all
          </Link>
        )}
      </div>

      <div className='flex flex-col'>
        {featuredPost && <ArticleBlock post={featuredPost} featured />}
        <ul className='flex flex-col list-none p-0 m-0'>
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
