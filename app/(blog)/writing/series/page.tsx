import { Metadata } from "next";
import Link from "next/link";
import SeriesCard from "@/components/SeriesCard";
import { getAllTopicsSafe } from "@/utils/services/getTopics";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: "Series",
  description:
    "Browse researched essays by series: Deep Learning, NLP, Rust, Blockchain, and more.",
  path: "/writing/series",
});

export default async function SeriesIndexPage() {
  const topics = await getAllTopicsSafe();
  const withPosts = topics.filter((t) => (t.subTopicList?.length ?? 0) > 0);

  return (
    <main className='mx-auto w-full max-w-5xl px-4 py-12 md:py-16'>
      <nav aria-label='Breadcrumb' className='mb-8 text-sm text-muted-foreground'>
        <Link
          href='/writing'
          className='hover:text-brand underline-offset-4 hover:underline'
        >
          Writing
        </Link>
        <span aria-hidden className='mx-2'>
          /
        </span>
        <span className='text-foreground'>Series</span>
      </nav>

      <header className='mb-10 flex flex-col gap-3 max-w-2xl'>
        <h1 className='font-display text-4xl md:text-5xl tracking-tight'>
          Series
        </h1>
        <p className='text-muted-foreground text-lg leading-relaxed'>
          Topic hubs for deeper reading paths. Each series groups related
          essays.
        </p>
      </header>

      {withPosts.length === 0 ? (
        <p className='text-muted-foreground'>
          Series will appear as topics grow.
        </p>
      ) : (
        <ul className='grid gap-4 sm:grid-cols-2 list-none p-0 m-0'>
          {withPosts.map((t) => (
            <li key={t.id}>
              <SeriesCard topic={t} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
