import Link from "next/link";
import { SubTopic } from "@/types/types";
import EssayCard from "@/components/EssayCard";
import { pickEssaysByIds } from "@/lib/homeConfig";

type Props = {
  posts: SubTopic[];
  /** Ordered essay ids from homepage config. */
  startHereIds?: number[];
};

export default function StartHere({ posts, startHereIds }: Props) {
  const items = pickEssaysByIds(posts, startHereIds || [], 3);
  if (!items.length) return null;

  return (
    <section
      aria-labelledby='start-here'
      className='home-section home-section-no-rule'
    >
      <div className='mb-8'>
        <p className='accent-label mb-2'>Start here</p>
        <h2
          id='start-here'
          className='display-title text-3xl text-foreground md:text-4xl'
        >
          Three places to begin
        </h2>
        <p className='mt-3 max-w-xl text-muted-foreground leading-relaxed'>
          Hand-picked essays to begin with. Updated from admin when needed.
        </p>
      </div>
      <ul className='m-0 flex list-none flex-col p-0'>
        {items.map((post) => (
          <li key={post.id}>
            <EssayCard post={post} />
          </li>
        ))}
      </ul>
      <p className='mt-4 text-sm text-muted-foreground'>
        Looking for more?{" "}
        <Link
          href='/writing'
          className='font-semibold text-brand underline-offset-4 hover:underline'
        >
          Browse all writing
        </Link>
      </p>
    </section>
  );
}
