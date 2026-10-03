import { Metadata } from "next";
import Link from "next/link";
import { getAllSubtopicsSorted } from "@/utils/services/getLatestSubtopics";
import { getAllTopicsSafe } from "@/utils/services/getTopics";
import { pageMeta } from "@/lib/seo";
import {
  eligibleTopicHubs,
  enrichPostsWithSeries,
  topicHubHref,
} from "@/lib/topicHubs";

export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: "Topics",
  description:
    "Topic hubs for essays with enough depth to browse as a group.",
  path: "/writing/topics",
});

export default async function TopicsIndexPage() {
  const [raw, topics] = await Promise.all([
    getAllSubtopicsSorted(),
    getAllTopicsSafe(),
  ]);
  const posts = enrichPostsWithSeries(raw, topics);
  const hubs = eligibleTopicHubs(posts);

  return (
    <main className='mx-auto w-full max-w-3xl px-4 py-12 md:py-16'>
      <nav aria-label='Breadcrumb' className='mb-8 text-sm text-muted-foreground'>
        <Link
          href='/writing'
          className='underline-offset-4 hover:text-brand hover:underline'
        >
          Writing
        </Link>
        <span aria-hidden className='mx-2'>
          /
        </span>
        <span className='text-foreground'>Topics</span>
      </nav>

      <header className='mb-10 flex max-w-2xl flex-col gap-3'>
        <p className='accent-label'>Library</p>
        <h1 className='display-title text-4xl md:text-5xl'>Topics</h1>
        <p className='text-muted-foreground leading-relaxed'>
          Hubs appear when a topic has at least three essays. Prefer{" "}
          <Link
            href='/writing/series'
            className='font-semibold text-brand underline-offset-4 hover:underline'
          >
            series
          </Link>{" "}
          for ordered reading paths.
        </p>
      </header>

      {hubs.length === 0 ? (
        <p className='text-muted-foreground'>
          No topic hubs yet. Browse{" "}
          <Link
            href='/writing'
            className='font-semibold text-brand underline-offset-4 hover:underline'
          >
            all writing
          </Link>{" "}
          or{" "}
          <Link
            href='/writing/series'
            className='font-semibold text-brand underline-offset-4 hover:underline'
          >
            series
          </Link>
          .
        </p>
      ) : (
        <ul className='m-0 flex list-none flex-col gap-3 p-0'>
          {hubs.map((h) => (
            <li key={h.tag}>
              <Link
                href={topicHubHref(h.tag)}
                className='flex min-h-11 items-baseline justify-between gap-4 border-b border-border py-3 text-foreground hover:text-brand'
              >
                <span className='font-medium capitalize'>{h.tag}</span>
                <span className='text-sm tabular-nums text-muted-foreground'>
                  {h.count} essays
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
