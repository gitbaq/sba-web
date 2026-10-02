import Link from "next/link";
import { SubTopic } from "@/types/types";
import EssayCard from "@/components/EssayCard";

/** Owner picks: Evolution of AI, NLP Primer, Rust. Move to admin (P3-24) later. */
const START_HERE_IDS = [18, 16, 14] as const;

type Props = {
  posts: SubTopic[];
};

export function pickStartHere(posts: SubTopic[], limit = 3): SubTopic[] {
  const byId = new Map(posts.map((p) => [p.id, p]));
  const picked: SubTopic[] = [];
  for (const id of START_HERE_IDS) {
    const post = byId.get(id);
    if (post) picked.push(post);
    if (picked.length >= limit) return picked;
  }
  for (const post of posts) {
    if (picked.some((p) => p.id === post.id)) continue;
    picked.push(post);
    if (picked.length >= limit) break;
  }
  return picked;
}

export default function StartHere({ posts }: Props) {
  const items = pickStartHere(posts, 3);
  if (!items.length) return null;

  return (
    <section aria-labelledby='start-here' className='home-section'>
      <div className='mb-8'>
        <p className='accent-label mb-2'>Start here</p>
        <h2
          id='start-here'
          className='display-title text-3xl text-foreground md:text-4xl'
        >
          Three places to begin
        </h2>
        <p className='mt-3 max-w-xl text-muted-foreground leading-relaxed'>
          Collective intelligence, an NLP primer, and Rust for safe systems
          work.
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
