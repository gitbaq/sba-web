"use client";

import Link from "next/link";
import Image from "next/image";
import { SubTopic, Topic } from "@/types/types";
import { getAudience, LINKEDIN_URL, AudienceId } from "@/lib/audience";
import { articleHref } from "@/lib/articles";
import { seriesHref } from "@/utils/services/getTopics";
import type { CaseStudy } from "@/lib/work";
import { seriesStyle } from "@/lib/seriesColors";
import LatestWriting from "./LatestWriting";
import Reveal from "@/components/Reveal";
import SubscribeForm from "@/components/SubscribeForm";
import Quote from "@/components/quote";
import Icons from "@/components/Icons";
import { trackCta } from "@/lib/analytics";
import type { RandomQuote } from "@/types/types";
import { CTA } from "@/lib/ctas";

type Props = {
  posts: SubTopic[];
  topics: Topic[];
  quote: RandomQuote | null;
  audience: AudienceId;
  onChangePath: () => void;
  /** API work projects only. Never seed/fallback list. */
  work?: CaseStudy[];
};

export default function BrandHome({
  posts,
  topics,
  quote,
  audience,
  onChangePath,
  work = [],
}: Props) {
  const path = getAudience(audience);
  const firstPost = posts[0];
  const series = topics.filter((t) => (t.subTopicList?.length ?? 0) > 0);

  return (
    <div className='flex flex-col w-full'>
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
        <div className='relative z-[2] mx-auto max-w-3xl px-4 pt-6 pb-10 md:pt-8 md:pb-12 flex flex-col gap-7'>
          <Reveal as='header' immediate className='flex flex-col gap-4'>
            <p className='accent-label'>Syed Baqir Ali</p>
            <h1
              id='home-brand'
              className='display-title text-4xl sm:text-5xl md:text-[3.35rem] text-foreground'
            >
              Bridging AI Research and Enterprise Engineering
            </h1>
            <p className='text-lg md:text-xl leading-relaxed max-w-xl text-muted-foreground'>
              Practical notes on software, AI integration, and leading teams.
              One careful essay at a time.
            </p>
          </Reveal>

          <Reveal delay={1} immediate className='flex flex-col sm:flex-row flex-wrap gap-3'>
            <Link
              href='/subscribe'
              className='craft-cta-primary'
              onClick={() =>
                trackCta(CTA.subscribe, "/subscribe", "home_hero")
              }
            >
              <Icons.Mail className='craft-cta-icon' aria-hidden />
              {CTA.subscribe}
            </Link>
            <Link
              href={firstPost ? articleHref(firstPost) : "/writing"}
              className='craft-cta-secondary'
              onClick={() =>
                trackCta(
                  CTA.writing,
                  firstPost ? articleHref(firstPost) : "/writing",
                  "home_hero"
                )
              }
            >
              <Icons.BookOpen className='craft-cta-icon' aria-hidden />
              {CTA.writing}
            </Link>
            <a
              href={LINKEDIN_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='craft-cta-secondary'
              onClick={() =>
                trackCta(CTA.linkedin, LINKEDIN_URL, "home_hero")
              }
            >
              <Icons.FaLinkedin className='craft-cta-icon' aria-hidden />
              {CTA.linkedin}
            </a>
          </Reveal>

          <Reveal delay={2} immediate>
            <p className='text-sm text-muted-foreground'>
              Continuing on the{" "}
              <Link
                href={path.href}
                className='font-medium text-foreground underline-offset-4 hover:underline'
              >
                {path.pathName}
              </Link>
              {" · "}
              <button
                type='button'
                onClick={onChangePath}
                className='font-medium text-brand underline-offset-4 hover:underline'
              >
                Change path
              </button>
            </p>
          </Reveal>
        </div>
      </section>

      <div className='home-body'>
        <div className='mx-auto w-full max-w-3xl px-4 py-12 md:py-16 flex flex-col gap-12 md:gap-14'>
          <Reveal immediate>
            <section className='home-section' aria-label='Latest writing'>
              <LatestWriting posts={posts} featured showViewAll />
            </section>
          </Reveal>

          {series.length > 0 && (
            <Reveal>
              <section
                aria-labelledby='browse-series'
                className='home-section home-section-band'
              >
                <p className='accent-label mb-2'>Browse by series</p>
                <h2
                  id='browse-series'
                  className='display-title text-2xl md:text-3xl mb-5'
                >
                  Topics
                </h2>
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
            </Reveal>
          )}

          {work.length > 0 ? (
          <Reveal>
            <section
              aria-labelledby='work-teaser'
              className='home-section'
            >
              <p className='accent-label mb-2'>Portfolio</p>
              <h2
                id='work-teaser'
                className='display-title text-2xl md:text-3xl mb-6'
              >
                Selected work
              </h2>
              <ul className='grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0 m-0'>
                {work.map((study) => (
                  <li key={study.slug}>
                    <Link
                      href={study.href}
                      className='flex items-center gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-elev1 transition-all hover:border-brand/40 hover:no-underline hover:-translate-y-0.5'
                    >
                      {study.mark ? (
                        <span className='relative h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-border/80'>
                          <Image
                            src={study.mark}
                            alt=''
                            fill
                            className='object-cover'
                            sizes='56px'
                          />
                        </span>
                      ) : null}
                      <span className='min-w-0'>
                        <span className='block font-display font-semibold text-lg text-foreground'>
                          {study.title}
                        </span>
                        <span className='block text-sm text-muted-foreground line-clamp-2'>
                          {study.tagline}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href='/work'
                className='inline-flex mt-5 text-sm font-semibold text-brand underline-offset-4 hover:underline'
              >
                All work
              </Link>
            </section>
          </Reveal>
          ) : null}

          <Reveal>
            <section className='home-section'>
              <Quote quote={quote} />
            </section>
          </Reveal>

          <Reveal>
            <section
              aria-labelledby='home-subscribe'
              className='home-section life-panel'
            >
              <p className='accent-label mb-2'>Newsletter</p>
              <h2
                id='home-subscribe'
                className='display-title text-2xl md:text-3xl mb-2'
              >
                Get new essays as they publish
              </h2>
              <p className='text-muted-foreground mb-6 max-w-md leading-relaxed'>
                Join the free list when a new essay goes out. No spam.
              </p>
              <SubscribeForm submitLabel={CTA.subscribe} />
              <p className='mt-4 text-xs text-muted-foreground'>
                Prefer feeds?{" "}
                <a
                  href='/feed.xml'
                  className='text-brand underline-offset-4 hover:underline'
                >
                  RSS
                </a>
              </p>
            </section>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
