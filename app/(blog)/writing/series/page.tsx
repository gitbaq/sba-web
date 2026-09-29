import { Metadata } from "next";
import Link from "next/link";
import { getAllTopicsSafe, seriesHref } from "@/utils/services/getTopics";

export const metadata: Metadata = {
  title: "Series — Writing",
  description:
    "Browse researched essays by series — Deep Learning, NLP, Rust, Blockchain, and more.",
};

export default async function SeriesIndexPage() {
  const topics = await getAllTopicsSafe();
  const withPosts = topics.filter((t) => (t.subTopicList?.length ?? 0) > 0);

  return (
    <main className='mx-auto w-full max-w-5xl px-4 py-12 md:py-16'>
      <nav aria-label='Breadcrumb' className='mb-8 text-sm text-muted-foreground'>
        <Link href='/writing' className='hover:text-brand underline-offset-4 hover:underline'>
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
          Topic hubs for deeper reading paths. Each series groups related essays.
        </p>
      </header>

      {withPosts.length === 0 ? (
        <p className='text-muted-foreground'>Series will appear as topics grow.</p>
      ) : (
        <ul className='grid gap-4 sm:grid-cols-2 list-none p-0 m-0'>
          {withPosts.map((t) => (
            <li key={t.id}>
              <Link
                href={seriesHref(t)}
                className='flex flex-col gap-1 rounded-lg border border-border p-5 h-full transition-colors hover:border-brand hover:bg-brand-muted/20'
              >
                <span className='font-display text-xl text-foreground'>
                  {t.sbaTopicName}
                </span>
                <span className='text-sm text-muted-foreground'>
                  {t.subTopicList.length}{" "}
                  {t.subTopicList.length === 1 ? "essay" : "essays"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
