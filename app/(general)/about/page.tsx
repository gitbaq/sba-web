import React from "react";
import Image from "next/image";
import Link from "next/link";
import Icons from "@/components/Icons";
import { Metadata } from "next";
import { LINKEDIN_URL, AUDIENCES } from "@/lib/audience";
import { CTA } from "@/lib/ctas";

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
        <section aria-labelledby='paths'>
          <p className='accent-label mb-2'>Paths</p>
          <h2 id='paths' className='display-title text-2xl md:text-3xl mb-6'>
            Choose how to browse
          </h2>
          <ul className='flex flex-col gap-3 list-none p-0 m-0'>
            {AUDIENCES.map((a) => (
              <li key={a.id}>
                <Link
                  href={a.href}
                  className='group flex flex-col gap-1 rounded-2xl border border-border/80 bg-card p-5 shadow-elev1 transition-all hover:border-brand/40 hover:-translate-y-0.5 hover:no-underline'
                >
                  <span className='font-display text-lg font-semibold text-foreground group-hover:text-brand transition-colors'>
                    {a.label}
                  </span>
                  <span className='text-sm text-muted-foreground leading-relaxed'>
                    {a.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
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
