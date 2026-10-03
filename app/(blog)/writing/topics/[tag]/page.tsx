import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SubscribeForm from "@/components/SubscribeForm";
import PaginatedEssayList from "@/components/writing/PaginatedEssayList";
import JsonLd from "@/components/JsonLd";
import { getAllSubtopicsSorted } from "@/utils/services/getLatestSubtopics";
import { getAllTopicsSafe } from "@/utils/services/getTopics";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { CTA } from "@/lib/ctas";
import { SUBSCRIBE } from "@/lib/copy";
import {
  essaysForTopicHub,
  eligibleTopicHubs,
  enrichPostsWithSeries,
  MIN_HUB_COUNT,
  topicHubHref,
  topicHubSlug,
} from "@/lib/topicHubs";

async function loadEnrichedPosts() {
  const [raw, topics] = await Promise.all([
    getAllSubtopicsSorted(),
    getAllTopicsSafe(),
  ]);
  return enrichPostsWithSeries(raw, topics);
}

type Params = Promise<{ tag: string }>;

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await loadEnrichedPosts();
  return eligibleTopicHubs(posts).map(({ tag }) => ({
    tag: topicHubSlug(tag),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { tag } = await params;
  const posts = await loadEnrichedPosts();
  const essays = essaysForTopicHub(posts, tag);
  if (essays.length < MIN_HUB_COUNT) return {};
  const label = tag.replace(/-/g, " ");
  return pageMeta({
    title: `Topic: ${label}`,
    description: `Essays tagged ${label}. ${essays.length} pieces by Syed Baqir Ali.`,
    path: `/writing/topics/${topicHubSlug(tag)}`,
  });
}

export default async function TopicHubPage({ params }: { params: Params }) {
  const { tag } = await params;
  const posts = await loadEnrichedPosts();
  const essays = essaysForTopicHub(posts, tag);
  if (essays.length < MIN_HUB_COUNT) notFound();

  const label = tag.replace(/-/g, " ");
  const hubs = eligibleTopicHubs(posts);

  return (
    <main className='mx-auto w-full max-w-3xl px-4 py-12 md:py-16'>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Writing", path: "/writing" },
          { name: "Topics", path: "/writing/topics" },
          { name: label, path: topicHubHref(tag) },
        ])}
      />
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
        <Link
          href='/writing/topics'
          className='underline-offset-4 hover:text-brand hover:underline'
        >
          Topics
        </Link>
        <span aria-hidden className='mx-2'>
          /
        </span>
        <span className='text-foreground'>{label}</span>
      </nav>

      <header className='mb-10 flex max-w-2xl flex-col gap-3'>
        <p className='accent-label'>Topic</p>
        <h1 className='display-title text-4xl tracking-tight md:text-5xl'>
          {label}
        </h1>
        <p className='text-muted-foreground'>
          {essays.length} {essays.length === 1 ? "essay" : "essays"}
        </p>
      </header>

      <PaginatedEssayList posts={essays} listLabel='Topic essays' />

      {hubs.length > 1 ? (
        <section className='mt-14 border-t border-border pt-10' aria-labelledby='more-topics'>
          <h2 id='more-topics' className='display-title mb-4 text-2xl'>
            More topics
          </h2>
          <ul className='m-0 flex list-none flex-wrap gap-2 p-0'>
            {hubs
              .filter((h) => topicHubSlug(h.tag) !== topicHubSlug(tag))
              .map((h) => (
                <li key={h.tag}>
                  <Link
                    href={`/writing/topics/${topicHubSlug(h.tag)}`}
                    className='inline-flex min-h-9 items-center rounded-full border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground'
                  >
                    {h.tag}
                    <span className='ml-1.5 tabular-nums opacity-70'>{h.count}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      <section
        aria-labelledby='topic-subscribe'
        className='mt-14 max-w-xl border-t border-border pt-10'
      >
        <p className='accent-label mb-2'>{SUBSCRIBE.eyebrow}</p>
        <h2 id='topic-subscribe' className='display-title mb-3 text-2xl md:text-3xl'>
          {SUBSCRIBE.heading}
        </h2>
        <p className='mb-4 leading-relaxed text-muted-foreground'>{SUBSCRIBE.blurb}</p>
        <SubscribeForm variant='end' submitLabel={CTA.subscribe} />
      </section>
    </main>
  );
}
