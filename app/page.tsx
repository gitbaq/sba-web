import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LatestWriting from "@/components/home/LatestWriting";
import StartHere from "@/components/home/StartHere";
import SubscribeForm from "@/components/SubscribeForm";
import { getLatestSubtopics, getAllSubtopicsSorted } from "@/utils/services/getLatestSubtopics";
import { pageMeta, SITE } from "@/lib/seo";
import { CASE_STUDIES } from "@/lib/work";
import { CTA } from "@/lib/ctas";
import { isIndexable } from "@/lib/articles";

export const metadata: Metadata = pageMeta({
  title: SITE.title,
  description: SITE.description,
  path: "/",
  absoluteTitle: true,
});

export default async function Home() {
  const [latest, all] = await Promise.all([
    getLatestSubtopics(5),
    getAllSubtopicsSorted(),
  ]);
  const indexable = all.filter(isIndexable);
  const featuredWork = CASE_STUDIES[0];

  return (
    <div className='flex w-full flex-col'>
      {/* 1. Hero: brand, one H1, one sub, subscribe only */}
      <section
        aria-labelledby='home-brand'
        className='life-hero life-hero-home relative w-full'
      >
        <div className='life-hero-blobs' aria-hidden>
          <span className='life-blob life-blob-1' />
          <span className='life-blob life-blob-2' />
          <span className='life-blob life-blob-3' />
          <span className='life-blob life-blob-4' />
        </div>
        <div className='relative z-[2] mx-auto flex max-w-3xl flex-col px-4 pt-6 pb-5 md:pt-8 md:pb-6'>
          <header className='flex flex-col gap-4'>
            <p className='accent-label'>{SITE.name}</p>
            <h1
              id='home-brand'
              className='display-title text-4xl text-foreground sm:text-5xl md:text-[3.35rem]'
            >
              Practical writing on AI, software, and leading teams.
            </h1>
            <p className='max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl'>
              Researched essays for engineers and technical leaders.
            </p>
          </header>

          <div className='hero-subscribe mt-6 md:mt-7'>
            <p className='mb-3 text-sm font-medium text-foreground'>
              Get new essays by email
            </p>
            <SubscribeForm variant='hero' submitLabel={CTA.subscribe} />
            <p className='mt-2 text-xs text-muted-foreground'>
              Weekly. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      <div className='home-body mx-auto flex w-full max-w-3xl flex-col px-4 pt-5 pb-8 md:pt-6 md:pb-10'>
        {/* 2. Latest essays */}
        {latest.length > 0 && (
          <div className='home-section'>
            <LatestWriting
              posts={latest.slice(0, 3)}
              title='Latest essays'
              showViewAll
              featured
            />
          </div>
        )}

        {/* 3. Start here */}
        <StartHere posts={indexable} />

        {/* 4. Work with me */}
        <section aria-labelledby='work-strip' className='home-section'>
          <p className='accent-label mb-2'>Work with me</p>
          <h2 id='work-strip' className='display-title text-2xl md:text-3xl'>
            Outcomes for product and engineering teams
          </h2>
          <p className='mt-3 max-w-xl text-muted-foreground leading-relaxed'>
            {featuredWork
              ? `${featuredWork.title}: ${featuredWork.tagline}`
              : "Selected delivery work across AI, cloud, and software systems."}
          </p>
          <Link
            href='/for/clients'
            className='mt-5 inline-flex min-h-11 items-center font-semibold text-brand underline-offset-4 hover:underline'
          >
            Explore client work
          </Link>
        </section>

        {/* 5. About snippet */}
        <section aria-labelledby='about-snip' className='home-section'>
          <p className='accent-label mb-2'>About</p>
          <div className='flex flex-col gap-5 sm:flex-row sm:items-start'>
            <Image
              src='/sba-photo-2-small.png'
              alt={`${SITE.name}`}
              width={96}
              height={96}
              className='h-24 w-24 shrink-0 rounded-full object-cover ring-1 ring-border'
              sizes='96px'
            />
            <div className='flex flex-col gap-3'>
              <h2 id='about-snip' className='display-title text-2xl'>
                {SITE.name}
              </h2>
              <p className='max-w-xl text-muted-foreground leading-relaxed'>
                I write and build at the intersection of AI research and
                enterprise engineering. Plain language, concrete tradeoffs.
              </p>
              <Link
                href='/about'
                className='inline-flex min-h-11 w-fit items-center font-semibold text-brand underline-offset-4 hover:underline'
              >
                More about me
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
