"use client";

import Link from "next/link";
import Image from "next/image";
import { SubTopic, Topic } from "@/types/types";
import { getAudience, LINKEDIN_URL, AudienceId } from "@/lib/audience";
import { articleHref } from "@/lib/articles";
import { seriesHref } from "@/utils/services/getTopics";
import { CASE_STUDIES } from "@/lib/work";
import { seriesStyle } from "@/lib/seriesColors";
import LatestWriting from "./LatestWriting";
import Reveal from "@/components/Reveal";
import SubscribeForm from "@/components/SubscribeForm";
import Icons from "@/components/Icons";
import { trackCta } from "@/lib/analytics";

type Props = {
  posts: SubTopic[];
  topics: Topic[];
  audience: AudienceId;
  onChangePath: () => void;
};

export default function BrandHome({
  posts,
  topics,
  audience,
  onChangePath,
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
        <div className='relative z-[2] mx-auto max-w-3xl px-4 pt-16 pb-20 md:pt-24 md:pb-28 flex flex-col gap-7'>
          <Reveal as='header' immediate className='flex flex-col gap-4'>
            <p className='accent-label'>Syed Baqir Ali</p>
            <h1
              id='home-brand'
              className='display-title text-4xl sm:text-5xl md:text-[3.35rem]'
            >
              Research-depth writing on AI and software
            </h1>
            <p className='text-lg md:text-xl leading-relaxed max-w-xl text-foreground/80'>
              Thorough, practical, and easy to follow — about one careful essay
              most weeks.
            </p>
          </Reveal>

          <Reveal delay={1} immediate className='flex flex-col sm:flex-row flex-wrap gap-3'>
            <Link
              href='/subscribe'
              className='craft-cta-primary'
              onClick={() => trackCta("Subscribe", "/subscribe", "home_hero")}
            >
              <Icons.Mail className='craft-cta-icon' aria-hidden />
              Subscribe
            </Link>
            <Link
              href={firstPost ? articleHref(firstPost) : "/writing"}
              className='craft-cta-secondary'
              onClick={() =>
                trackCta(
                  "Read latest",
                  firstPost ? articleHref(firstPost) : "/writing",
                  "home_hero"
                )
              }
            >
              <Icons.BookOpen className='craft-cta-icon' aria-hidden />
              Read latest
            </Link>
            <a
              href={LINKEDIN_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='craft-cta-secondary'
              onClick={() => trackCta("LinkedIn", LINKEDIN_URL, "home_hero")}
            >
              <Icons.FaLinkedin className='craft-cta-icon' aria-hidden />
              LinkedIn
            </a>
          </Reveal>

          <Reveal delay={2} immediate>
            <p className='text-sm text-muted-foreground'>
              Continuing on the{" "}
              <Link
                href={path.href}
                className='text-foreground font-medium underline-offset-4 hover:underline'
              >
                {path.pathName}
              </Link>
              {" · "}
              <button
                type='button'
                onClick={onChangePath}
                className='text-brand font-medium underline-offset-4 hover:underline'
              >
                Change path
              </button>
            </p>
          </Reveal>
        </div>
      </section>

      <div className='mx-auto w-full max-w-3xl px-4 py-10 md:py-14 flex flex-col gap-16 md:gap-20'>
        <Reveal immediate>
          <LatestWriting posts={posts} featured showViewAll />
        </Reveal>

        {series.length > 0 && (
          <Reveal>
            <section aria-labelledby='browse-series'>
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

        <Reveal>
          <section aria-labelledby='work-teaser'>
            <p className='accent-label mb-2'>Portfolio</p>
            <h2
              id='work-teaser'
              className='display-title text-2xl md:text-3xl mb-6'
            >
              Selected work
            </h2>
            <ul className='grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0 m-0'>
              {CASE_STUDIES.map((study) => (
                <li key={study.slug}>
                  <Link
                    href={study.href}
                    className='flex items-center gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-elev1 transition-all hover:border-brand/40 hover:no-underline hover:-translate-y-0.5'
                  >
                    <span className='relative h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-border/80'>
                      <Image
                        src={study.mark}
                        alt=''
                        fill
                        className='object-cover'
                        sizes='56px'
                      />
                    </span>
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

        <Reveal>
          <section
            aria-labelledby='home-subscribe'
            className='life-panel'
          >
            <p className='accent-label mb-2'>Newsletter</p>
            <h2
              id='home-subscribe'
              className='display-title text-2xl md:text-3xl mb-2'
            >
              Get new essays first
            </h2>
            <p className='text-muted-foreground mb-6 max-w-md leading-relaxed'>
              Want to know when I publish? Join the free list — no spam, just
              careful writing.
            </p>
            <SubscribeForm submitLabel='Subscribe' />
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
  );
}
