import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import Icons from "@/components/Icons";
import { LINKEDIN_URL } from "@/lib/audience";
import { CTA } from "@/lib/ctas";
import CredentialsStrip from "@/components/CredentialsStrip";
import { pageMeta } from "@/lib/seo";
import { getAboutConfig } from "@/lib/work";

export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: "About",
  description:
    "Software innovation and AI leadership. Researched writing, shipped products, and practical delivery for teams.",
  path: "/about",
});

export default async function About() {
  const about = await getAboutConfig();

  return (
    <div className='w-full'>
      <div className='life-hero'>
        <div className='relative z-[2] mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 pt-20 pb-12 text-center md:pt-24 md:pb-16'>
          <div className='relative h-36 w-36 shrink-0 overflow-hidden rounded-full bg-brand/15 ring-2 ring-border/80 shadow-elev1 md:h-44 md:w-44'>
            <Image
              className='object-cover'
              src={about.photoUrl}
              alt={`${about.displayName} portrait`}
              fill
              priority
              sizes='176px'
              unoptimized={about.photoUrl.startsWith("http")}
            />
          </div>
          <header className='flex flex-col gap-3'>
            <p className='accent-label'>About</p>
            <h1 className='display-title text-4xl md:text-5xl text-foreground'>
              {about.displayName}
            </h1>
            <p className='text-lg text-foreground/80'>{about.title}</p>
            <p className='mx-auto max-w-xl text-muted-foreground leading-relaxed'>
              {about.bio}
            </p>
            <div className='flex flex-wrap gap-3 justify-center pt-2'>
              <Link href='/writing' className='craft-cta-secondary'>
                <Icons.BookOpen className='craft-cta-icon' aria-hidden />
                {CTA.writing}
              </Link>
              <Link href='/work' className='craft-cta-secondary'>
                <Icons.FolderCode className='craft-cta-icon' aria-hidden />
                {CTA.work}
              </Link>
              <a
                href={LINKEDIN_URL}
                target='_blank'
                rel='noopener noreferrer'
                className='craft-cta-secondary'
              >
                <Icons.FaLinkedin className='craft-cta-icon' aria-hidden />
                {CTA.linkedin}
              </a>
            </div>
          </header>
        </div>
      </div>

      <main className='mx-auto flex w-full max-w-3xl flex-col gap-12 px-4 py-10 md:py-14'>
        <section aria-labelledby='credentials'>
          <p className='accent-label mb-2'>Background</p>
          <h2
            id='credentials'
            className='display-title text-2xl md:text-3xl mb-6'
          >
            Credentials
          </h2>
          <CredentialsStrip credentials={about.credentials} />
        </section>

        <section aria-labelledby='teaching' className='life-panel'>
          <p className='accent-label mb-2'>Teaching</p>
          <h2 id='teaching' className='display-title text-2xl md:text-3xl mb-3'>
            Teaching and mentoring
          </h2>
          <p className='max-w-xl leading-relaxed text-muted-foreground'>
            Casual Academic in Computer Science and IT at UNSW Sydney. I teach
            and mentor with the same plain, practical style as the essays on this
            site.
          </p>
          <p className='mt-3 max-w-xl text-sm text-muted-foreground'>
            TODO(owner): approve or expand teaching copy before treating it as
            final.
          </p>
        </section>

        <section
          id='hiring'
          aria-labelledby='hiring-heading'
          className='scroll-mt-24 life-panel'
        >
          <p className='accent-label mb-2'>Hiring</p>
          <h2
            id='hiring-heading'
            className='display-title text-2xl md:text-3xl mb-3'
          >
            For hiring managers
          </h2>
          <p className='text-muted-foreground leading-relaxed mb-5 max-w-xl'>
            {about.hiringBlurb}
          </p>
          <div className='mb-5 max-w-xl rounded-lg border border-dashed border-border bg-secondary/20 p-4 text-sm text-muted-foreground'>
            TODO(owner): add a downloadable CV PDF and a short career timeline
            here.
          </div>
          <div className='flex flex-wrap gap-3'>
            <a
              href={LINKEDIN_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='craft-cta-primary'
            >
              <Icons.FaLinkedin className='craft-cta-icon' aria-hidden />
              LinkedIn profile
            </a>
            <Link href='/contact' className='craft-cta-secondary'>
              <Icons.Mails className='craft-cta-icon' aria-hidden />
              {CTA.contact}
            </Link>
            <Link href='/work' className='craft-cta-secondary'>
              Case studies
            </Link>
          </div>
        </section>

        <section aria-labelledby='portfolio-link' className='life-panel'>
          <p className='accent-label mb-2'>Portfolio</p>
          <h2 id='portfolio-link' className='display-title text-2xl mb-3'>
            Work, separate from Writing
          </h2>
          <p className='text-muted-foreground leading-relaxed mb-4'>
            Case studies live under Work: problem, approach, outcome, and stack.
          </p>
          <Link
            href='/work'
            className='text-brand font-semibold underline-offset-4 hover:underline w-fit'
          >
            View work
          </Link>
        </section>
      </main>
    </div>
  );
}
