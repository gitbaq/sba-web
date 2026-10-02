import { Metadata } from "next";
import Link from "next/link";
import WritingIndex from "@/components/writing/WritingIndex";
import StartHere from "@/components/home/StartHere";
import SeriesCard from "@/components/SeriesCard";
import { getAllSubtopicsSorted } from "@/utils/services/getLatestSubtopics";
import { getAllTopicsSafe } from "@/utils/services/getTopics";
import { isIndexable } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Essays on AI, software, and systems. Newest first. New essays weekly.",
  alternates: {
    canonical: "/writing",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    title: "Writing | Syed Baqir Ali",
    description:
      "Essays on AI, software, and systems. Newest first. New essays weekly.",
    url: "/writing",
  },
};

type SearchParams = Promise<{ query?: string; tag?: string }>;

export default async function WritingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { query, tag } = await searchParams;
  const posts = (await getAllSubtopicsSorted()).filter(isIndexable);
  const topics = await getAllTopicsSafe();
  const series = topics.filter((t) => (t.subTopicList?.length ?? 0) > 0);

  return (
    <div className='w-full'>
      <div className='life-hero'>
        <header className='relative z-[2] mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 pt-6 pb-12 md:pt-8 md:pb-16'>
          <p className='accent-label'>Library</p>
          <h1 className='display-title text-4xl md:text-5xl text-foreground'>
            Writing
          </h1>
          <p className='text-muted-foreground text-lg leading-relaxed max-w-xl'>
            Essays on AI, software, and systems. Newest first. New essays
            weekly.
          </p>
          <p className='flex flex-wrap gap-x-3 gap-y-1 text-sm pt-1'>
            <Link
              href='/subscribe'
              className='text-brand font-semibold underline-offset-4 hover:underline'
            >
              Subscribe
            </Link>
            <a
              href='/feed.xml'
              className='text-muted-foreground underline-offset-4 hover:underline'
            >
              RSS
            </a>
            <Link
              href='/writing/series'
              className='text-muted-foreground underline-offset-4 hover:underline'
            >
              Browse series
            </Link>
          </p>
        </header>
      </div>

      <main className='mx-auto w-full max-w-3xl px-4 py-10 md:py-14 flex flex-col gap-14'>
        <StartHere posts={posts} />

        {series.length > 0 && (
          <section aria-labelledby='series-cards'>
            <div className='mb-6 flex flex-wrap items-end justify-between gap-3'>
              <div>
                <p className='accent-label mb-1'>Browse</p>
                <h2
                  id='series-cards'
                  className='display-title text-2xl md:text-3xl'
                >
                  Series
                </h2>
              </div>
              <Link
                href='/writing/series'
                className='text-sm font-semibold text-brand underline-offset-4 hover:underline'
              >
                All series
              </Link>
            </div>
            <ul className='grid gap-4 sm:grid-cols-2 list-none p-0 m-0'>
              {series.map((t) => (
                <li key={t.id}>
                  <SeriesCard topic={t} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby='all-essays'>
          <div className='mb-6'>
            <p className='accent-label mb-1'>Library</p>
            <h2
              id='all-essays'
              className='display-title text-2xl md:text-3xl'
            >
              All essays
            </h2>
          </div>
          <WritingIndex
            posts={posts}
            series={series}
            initialQuery={query || ""}
            initialTag={tag || ""}
          />
        </section>
      </main>
    </div>
  );
}
