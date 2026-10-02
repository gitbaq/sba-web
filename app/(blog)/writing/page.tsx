import { Metadata } from "next";
import Link from "next/link";
import WritingIndex from "@/components/writing/WritingIndex";
import LatestWriting from "@/components/home/LatestWriting";
import { getAllSubtopicsSorted } from "@/utils/services/getLatestSubtopics";
import { getAllTopicsSafe, seriesHref } from "@/utils/services/getTopics";
import { postsThisWeek } from "@/lib/feed";
import { seriesStyle } from "@/lib/seriesColors";
import { isIndexable } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Essays on AI, software, and systems. Newest first. New essays as they publish.",
  alternates: {
    canonical: "/writing",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    title: "Writing | Syed Baqir Ali",
    description:
      "Essays on AI, software, and systems. Newest first. New essays as they publish.",
    url: "/writing",
  },
};

type SearchParams = Promise<{ query?: string }>;

export default async function WritingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { query } = await searchParams;
  const posts = (await getAllSubtopicsSorted()).filter(isIndexable);
  const topics = await getAllTopicsSafe();
  const weekly = postsThisWeek(posts, 7);
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
            Essays on AI, software, and systems. Newest first. New essays as
            they publish.
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

      <main className='mx-auto w-full max-w-3xl px-4 py-10 md:py-14'>
        {weekly.length > 0 && (
          <div className='mb-14'>
            <LatestWriting
              posts={weekly}
              title='New this week'
              showViewAll={false}
              featured
            />
          </div>
        )}

        {series.length > 0 && (
          <section
            aria-labelledby='series-strip'
            className='mb-14 life-panel'
          >
            <div className='flex flex-wrap items-end justify-between gap-3 mb-4'>
              <div>
                <p className='accent-label mb-1'>Browse</p>
                <h2
                  id='series-strip'
                  className='font-display text-2xl font-semibold'
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
            <ul className='flex flex-wrap gap-2.5 list-none p-0 m-0'>
              {series.map((t) => (
                <li key={t.id}>
                  <Link
                    href={seriesHref(t)}
                    className='series-chip'
                    style={seriesStyle(t.sbaTopicName)}
                  >
                    {t.sbaTopicName}
                    <span className='ml-1.5 opacity-70 tabular-nums'>
                      {t.subTopicList.length}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <WritingIndex posts={posts} initialQuery={query || ""} />
      </main>
    </div>
  );
}
