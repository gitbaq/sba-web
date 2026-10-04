import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LatestWriting from "@/components/home/LatestWriting";
import StartHere from "@/components/home/StartHere";
import SubscribeForm from "@/components/SubscribeForm";
import {
  getLatestSubtopics,
  getAllSubtopicsSorted,
} from "@/utils/services/getLatestSubtopics";
import { pageMeta, SITE } from "@/lib/seo";
import { CADENCE_LINE } from "@/lib/copy";
import { CTA } from "@/lib/ctas";
import { isIndexable } from "@/lib/articles";
import {
  buildLatestWithBoost,
  getHomePageConfig,
} from "@/lib/homeConfig";
import { getAboutConfig, getWorkProjects } from "@/lib/work";

export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: SITE.title,
  description: SITE.description,
  path: "/",
  absoluteTitle: true,
});

export default async function Home() {
  const [latest, all, homeConfig, about, work] = await Promise.all([
    getLatestSubtopics(5),
    getAllSubtopicsSorted(),
    getHomePageConfig(),
    getAboutConfig(),
    getWorkProjects(),
  ]);
  const indexable = all.filter(
    (p) =>
      (p.isPublished === true ||
        p.isPublished === "true" ||
        p.isPublished === "1") &&
      isIndexable(p)
  );
  const startHereIds = homeConfig.startHereEssayIds;
  const latestForHome = buildLatestWithBoost(
    latest,
    indexable,
    homeConfig.featuredEssayId,
    3,
    startHereIds
  );
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
        <div className='relative z-[2] mx-auto flex max-w-4xl flex-col px-4 pt-6 pb-5 md:pt-8 md:pb-6'>
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
              {CADENCE_LINE} Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      <div className='home-body mx-auto flex w-full max-w-4xl flex-col px-4 pt-5 pb-8 md:pt-6 md:pb-10'>
        {/* 2. Latest essays */}
        <div className='home-section'>
          {latestForHome.length > 0 ? (
            <LatestWriting
              posts={latestForHome}
              title='Latest essays'
              showViewAll
              featured
            />
          ) : (
            <section aria-labelledby='latest-empty'>
              <p className='accent-label mb-2'>Writing</p>
              <h2
                id='latest-empty'
                className='display-title text-3xl md:text-4xl'
              >
                Latest essays
              </h2>
              <p className='mt-3 text-muted-foreground'>
                Essays will appear here shortly.{" "}
                <Link
                  href='/writing'
                  className='font-semibold text-brand underline-offset-4 hover:underline'
                >
                  Browse writing
                </Link>
              </p>
            </section>
          )}
        </div>

        {/* 3. Start here */}
        <StartHere posts={indexable} startHereIds={startHereIds} />

        {/* 4. Work with me */}
        <section aria-labelledby='work-strip' className='home-section'>
          <p className='accent-label mb-2'>Work with me</p>
          <h2 id='work-strip' className='display-title text-2xl md:text-3xl'>
            AI, cloud, and delivery for product teams
          </h2>
          <p className='mt-3 max-w-xl text-muted-foreground leading-relaxed'>
            Custom AI slices, cloud integration, and release automation. See
            services, credentials, and how to book a call.
          </p>
          {work.length > 0 ? (
            <ul className='mt-4 m-0 flex list-none flex-col gap-3 p-0'>
              {work.map((study) => (
                <li key={study.slug}>
                  <Link
                    href={study.href}
                    className='group inline-flex min-h-11 flex-col justify-center'
                  >
                    <span className='font-semibold text-foreground group-hover:text-brand'>
                      {study.title}
                    </span>
                    <span className='text-sm text-muted-foreground leading-relaxed'>
                      {study.result || study.tagline}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          <div className='mt-5 flex flex-wrap gap-x-5 gap-y-2'>
            <Link
              href='/work-with-me'
              className='inline-flex min-h-11 items-center font-semibold text-brand underline-offset-4 hover:underline'
            >
              See what I offer
            </Link>
            <Link
              href='/work-with-me#get-in-touch'
              className='inline-flex min-h-11 items-center text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-brand hover:underline'
            >
              Get in touch
            </Link>
          </div>
        </section>

        {/* 5. About snippet */}
        <section aria-labelledby='about-snip' className='home-section'>
          <p className='accent-label mb-2'>About</p>
          <div className='flex flex-col gap-5 sm:flex-row sm:items-start'>
            <Image
              src={about.photoUrl}
              alt={about.displayName}
              width={96}
              height={96}
              className='h-24 w-24 shrink-0 rounded-full object-cover ring-1 ring-border'
              sizes='96px'
              unoptimized={about.photoUrl.startsWith("http")}
            />
            <div className='flex flex-col gap-3'>
              <h2 id='about-snip' className='display-title text-2xl'>
                {about.displayName}
              </h2>
              <p className='max-w-xl text-muted-foreground leading-relaxed'>
                {about.homeBlurb}
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
