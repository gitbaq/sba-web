import Link from "next/link";
import { SubTopic } from "@/types/types";
import EssayCard from "@/components/EssayCard";

type Props = {
  posts: SubTopic[];
};

/** Discovery strip: popular essays from other series (curated until view counts). */
export default function PopularEssaysHero({ posts }: Props) {
  if (!posts.length) return null;

  return (
    <section
      aria-labelledby='popular-essays'
      className='life-panel flex flex-col gap-6'
    >
      <div className='flex flex-wrap items-end justify-between gap-3'>
        <div>
          <p className='accent-label mb-2'>Discover</p>
          <h2
            id='popular-essays'
            className='display-title text-2xl md:text-3xl'
          >
            Popular from other series
          </h2>
          <p className='mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground'>
            Strong reads from other series on this site.
          </p>
        </div>
        <Link
          href='/writing'
          className='text-sm font-semibold text-brand underline-offset-4 hover:underline'
        >
          All writing
        </Link>
      </div>
      <ul className='m-0 flex list-none flex-col p-0'>
        {posts.map((post) => (
          <li key={post.id}>
            <EssayCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
}
