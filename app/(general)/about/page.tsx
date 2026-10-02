import React from "react";
import Image from "next/image";
import Link from "next/link";
import Icons from "@/components/Icons";
import { Metadata } from "next";
import { LINKEDIN_URL } from "@/lib/audience";
import { CTA } from "@/lib/ctas";
import CredentialsStrip from "@/components/CredentialsStrip";

export const metadata: Metadata = {
  title: "About Syed Baqir Ali | AI & Software Innovation",
  description:
    "Software innovation and AI leadership. Researched writing, shipped products, and practical delivery for teams.",
};

export default function About() {
  return (
    <div className='w-full'>
      <div className='life-hero'>
        <div className='relative z-[2] mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 pt-20 pb-12 text-center md:pt-24 md:pb-16'>
          <div className='relative h-36 w-36 shrink-0 overflow-hidden rounded-full bg-brand/15 ring-2 ring-border/80 shadow-elev1 md:h-44 md:w-44'>
            <Image
              className='object-cover'
              src='/sba-photo-2-small.png'
              alt='Syed Baqir Ali'
              fill
              priority
              sizes='176px'
            />
          </div>
          <header className='flex flex-col gap-3'>
            <p className='accent-label'>About</p>
            <h1 className='display-title text-4xl md:text-5xl text-foreground'>
              Syed Baqir Ali
            </h1>
            <p className='text-lg text-foreground/80'>
              Software innovation and AI leader
            </p>
            <p className='mx-auto max-w-xl text-muted-foreground leading-relaxed'>
              Through writing and shipped work, I help individuals and teams
              harness technology, streamline processes, and build projects that
              make an impact. Research-depth, still easy to follow.
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
          <CredentialsStrip />
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
            Background, writing samples, and how I think about systems. Profile
            and experience live on LinkedIn; case studies and essays are on this
            site.
          </p>
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
            <Link href='/for/hiring' className='craft-cta-secondary'>
              <Icons.FolderCode className='craft-cta-icon' aria-hidden />
              Review for a role
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
            SWE / SME on Cobu (brainstorming ideas) and Blox (keeping focus on
            the task).
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
