import { Metadata } from "next";
import Link from "next/link";
import WritingIndex from "@/components/writing/WritingIndex";
import StartHere from "@/components/home/StartHere";
import SeriesCard from "@/components/SeriesCard";
import { getAllSubtopicsSorted } from "@/utils/services/getLatestSubtopics";
import { getAllTopicsSafe } from "@/utils/services/getTopics";
import { isIndexable } from "@/lib/articles";
import { getHomePageConfig } from "@/lib/homeConfig";
import { pageMeta } from "@/lib/seo";
import {
  eligibleTopicHubs,
  enrichPostsWithSeries,
  searchEssays,
} from "@/lib/topicHubs";

export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: "Writing",
  description:
    "Essays on AI, software, and systems. Newest first. New essays as they publish.",
  path: "/writing",
});

type SearchParams = Promise<{ query?: string; tag?: string }>;

export default async function WritingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { query, tag } = await searchParams;
  const [topics, homeConfig] = await Promise.all([
    getAllTopicsSafe(),
    getHomePageConfig(),
  ]);
  const allPosts = enrichPostsWithSeries(
    (await getAllSubtopicsSorted()).filter(isIndexable),
    topics
  );
  const searched =
    query && query.trim().length >= 2 ? await searchEssays(query) : null;
  const posts = searched
    ? enrichPostsWithSeries(searched, topics)
    : allPosts;
  const series = topics.filter((t) => (t.subTopicList?.length ?? 0) > 0);
  const hubs = eligibleTopicHubs(allPosts);

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
              Subscribe to Newsletter
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

      <main className='page-stack mx-auto w-full max-w-3xl px-4 py-10 md:py-14'>
        {!searched ? (
          <StartHere
            posts={allPosts}
            startHereIds={homeConfig.startHereEssayIds}
          />
        ) : null}

        {searched ? (
          <p className='page-section text-sm text-muted-foreground'>
            Showing server search results for “{(query || "").trim()}”.{" "}
            <Link
              href='/writing'
              className='font-semibold text-brand underline-offset-4 hover:underline'
            >
              Clear search
            </Link>
          </p>
        ) : null}

        {!searched && series.length > 0 && (
          <section aria-labelledby='series-cards' className='page-section'>
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
            <ul className='m-0 grid list-none gap-4 p-0 sm:grid-cols-2'>
              {series.map((t) => (
                <li key={t.id}>
                  <SeriesCard topic={t} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {!searched && hubs.length > 0 ? (
          <p className='page-section page-section-no-rule text-sm text-muted-foreground'>
            Topic hubs:{" "}
            <Link
              href='/writing/topics'
              className='font-semibold text-brand underline-offset-4 hover:underline'
            >
              Browse topics
            </Link>
          </p>
        ) : null}

        <section aria-labelledby='all-essays' className='page-section'>
          <div className='mb-6'>
            <p className='accent-label mb-1'>Library</p>
            <h2
              id='all-essays'
              className='display-title text-2xl md:text-3xl'
            >
              {searched ? "Search results" : "All essays"}
            </h2>
          </div>
          <WritingIndex
            posts={posts}
            series={series}
            initialQuery={query || ""}
            initialTag={tag || ""}
            hubTags={hubs.map((h) => h.tag)}
            serverSearchActive={Boolean(searched)}
          />
        </section>
      </main>
    </div>
  );
}
