import { Metadata } from "next";
import Link from "next/link";
import LatestWriting from "@/components/home/LatestWriting";
import SubscribeForm from "@/components/SubscribeForm";
import Quote from "@/components/quote";
import { getLatestSubtopics } from "@/utils/services/getLatestSubtopics";
import { getRandomQuote } from "@/utils/services/getRandomQuote";
import { pageMeta, SITE } from "@/lib/seo";
import { CASE_STUDIES } from "@/lib/work";
import { articleHref } from "@/lib/articles";
import Icons from "@/components/Icons";
import { CTA } from "@/lib/ctas";

export const metadata: Metadata = pageMeta({
  title: SITE.title,
  description: SITE.description,
  path: "/",
  absoluteTitle: true,
});

export default async function Home() {
  const [posts, quote] = await Promise.all([
    getLatestSubtopics(5),
    getRandomQuote(),
  ]);
  const firstPost = posts[0];
  const featuredWork = CASE_STUDIES[0];

  return (
    <div className='flex w-full flex-col'>
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
        <div className='relative z-[2] mx-auto flex max-w-3xl flex-col gap-7 px-4 pt-6 pb-10 md:pt-8 md:pb-12'>
          <header className='flex flex-col gap-4'>
            <p className='accent-label'>{SITE.name}</p>
            <h1
              id='home-brand'
              className='display-title text-4xl text-foreground sm:text-5xl md:text-[3.35rem]'
            >
              Practical writing on AI, software, and leading teams
            </h1>
            <p className='max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl'>
              {SITE.tagline} New essays as they publish.
            </p>
          </header>

          <div className='max-w-md'>
            <SubscribeForm submitLabel={CTA.subscribe} />
            <p className='mt-2 text-xs text-muted-foreground'>
              Unsubscribe anytime.
            </p>
          </div>

          <div className='flex flex-col flex-wrap gap-3 sm:flex-row'>
            <Link
              href={firstPost ? articleHref(firstPost) : "/writing"}
              className='craft-cta-secondary'
            >
              <Icons.BookOpen className='craft-cta-icon' aria-hidden />
              {CTA.writing}
            </Link>
            <a
              href={SITE.linkedin}
              target='_blank'
              rel='noopener noreferrer'
              className='craft-cta-secondary'
            >
              <Icons.FaLinkedin className='craft-cta-icon' aria-hidden />
              {CTA.linkedin}
            </a>
          </div>
        </div>
      </section>

      <div className='home-body mx-auto flex w-full max-w-3xl flex-col gap-16 px-4 py-12 md:gap-20 md:py-16'>
        {posts.length > 0 && (
          <LatestWriting
            posts={posts.slice(0, 3)}
            title='Latest essays'
            showViewAll
            featured
          />
        )}

        <section aria-labelledby='work-strip' className='flex flex-col gap-3'>
          <p className='accent-label'>Work with me</p>
          <h2 id='work-strip' className='display-title text-2xl md:text-3xl'>
            Outcomes for product and engineering teams
          </h2>
          <p className='max-w-xl text-muted-foreground leading-relaxed'>
            {featuredWork
              ? `${featuredWork.title}: ${featuredWork.tagline}`
              : "Selected delivery work across AI, cloud, and software systems."}
          </p>
          <Link
            href='/for/clients'
            className='w-fit font-semibold text-brand underline-offset-4 hover:underline'
          >
            Explore the work
          </Link>
        </section>

        {quote && <Quote quote={quote} />}

        <section aria-labelledby='about-snip' className='flex flex-col gap-3'>
          <p className='accent-label'>About</p>
          <h2 id='about-snip' className='display-title text-2xl'>
            {SITE.name}
          </h2>
          <p className='max-w-xl text-muted-foreground leading-relaxed'>
            I write and build at the intersection of AI research and enterprise
            engineering. Plain language, concrete tradeoffs.
          </p>
          <Link
            href='/about'
            className='w-fit font-semibold text-brand underline-offset-4 hover:underline'
          >
            More about me
          </Link>
        </section>
      </div>
    </div>
  );
}
