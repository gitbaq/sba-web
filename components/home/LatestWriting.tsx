import Link from "next/link";
import { SubTopic } from "@/types/types";
import EssayCard from "@/components/EssayCard";

type Props = {
  posts: SubTopic[];
  title?: string;
  className?: string;
  showViewAll?: boolean;
  featured?: boolean;
};

export default function LatestWriting({
  posts,
  title = "Latest essays",
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
          New essays weekly.{" "}
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
      <div className='mb-8 flex flex-row items-end justify-between gap-4'>
        <div>
          <p className='accent-label mb-2'>Writing</p>
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
        {featuredPost && <EssayCard post={featuredPost} featured />}
        <ul className='m-0 flex list-none flex-col p-0'>
          {list.map((post) => (
            <li key={post.id}>
              <EssayCard post={post} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
