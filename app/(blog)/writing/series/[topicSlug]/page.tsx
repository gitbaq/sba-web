import { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import LatestWriting from "@/components/home/LatestWriting";
import {
  getAllTopicsSafe,
  getTopicById,
  parseSeriesParam,
  seriesHref,
  seriesSlug,
} from "@/utils/services/getTopics";

type Params = Promise<{ topicSlug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { topicSlug } = await params;
  const parsed = parseSeriesParam(topicSlug);
  if (!parsed) return {};
  const topics = await getAllTopicsSafe();
  const topic = getTopicById(topics, parsed.id);
  if (!topic) return {};
  return {
    title: `${topic.sbaTopicName} — Series`,
    description: `Essays in the ${topic.sbaTopicName} series by Syed Baqir Ali.`,
  };
}

export default async function SeriesDetailPage({
  params,
}: {
  params: Params;
}) {
  const { topicSlug } = await params;
  const parsed = parseSeriesParam(topicSlug);
  if (!parsed) notFound();

  const topics = await getAllTopicsSafe();
  const topic = getTopicById(topics, parsed.id);
  if (!topic) notFound();

  const canonical = seriesSlug(topic);
  if (topicSlug !== canonical) {
    permanentRedirect(seriesHref(topic));
  }

  const posts = [...(topic.subTopicList || [])].sort((a, b) => {
    const aT = Date.parse(a.publishDate || a.updateDate || a.createDate || "");
    const bT = Date.parse(b.publishDate || b.updateDate || b.createDate || "");
    return (Number.isFinite(bT) ? bT : 0) - (Number.isFinite(aT) ? aT : 0);
  });

  return (
    <main className='mx-auto w-full max-w-5xl px-4 py-12 md:py-16'>
      <nav aria-label='Breadcrumb' className='mb-8 text-sm text-muted-foreground'>
        <Link href='/writing' className='hover:text-brand underline-offset-4 hover:underline'>
          Writing
        </Link>
        <span aria-hidden className='mx-2'>
          /
        </span>
        <Link
          href='/writing/series'
          className='hover:text-brand underline-offset-4 hover:underline'
        >
          Series
        </Link>
        <span aria-hidden className='mx-2'>
          /
        </span>
        <span className='text-foreground'>{topic.sbaTopicName}</span>
      </nav>

      <header className='mb-10 flex flex-col gap-3 max-w-2xl'>
        <p className='text-sm uppercase tracking-wide text-brand font-semibold'>
          Series
        </p>
        <h1 className='font-display text-4xl md:text-5xl tracking-tight'>
          {topic.sbaTopicName}
        </h1>
        <p className='text-muted-foreground'>
          {posts.length} {posts.length === 1 ? "essay" : "essays"} · newest
          first
        </p>
        <p>
          <Link
            href='/subscribe'
            className='text-brand font-medium underline-offset-4 hover:underline'
          >
            Subscribe
          </Link>
          {" · "}
          <a
            href='/feed.xml'
            className='text-muted-foreground underline-offset-4 hover:underline'
          >
            RSS
          </a>
        </p>
      </header>

      <LatestWriting
        posts={posts}
        title='Essays in this series'
        showViewAll={false}
      />
    </main>
  );
}
