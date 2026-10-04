import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import Icons from "@/components/Icons";
import { LINKEDIN_URL } from "@/lib/audience";
import {
  ABOUT_META_DESCRIPTION,
  ABOUT_WHAT_I_DO,
} from "@/lib/aboutContent";
import { CTA } from "@/lib/ctas";
import CredentialsStrip from "@/components/CredentialsStrip";
import { pageMeta } from "@/lib/seo";
import { CALENDLY_URL, getAboutConfig } from "@/lib/work";

export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: "About",
  description: ABOUT_META_DESCRIPTION,
  path: "/about",
});

export default async function About() {
  const about = await getAboutConfig();
  // Always render API/admin bio. Split on newlines when present; never substitute hardcoded copy.
  const bioParagraphs = about.bio
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className='w-full'>
      <div className='life-hero'>
        <div className='relative z-[2] mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 pt-20 pb-12 text-center md:pt-24 md:pb-16'>
          {about.photoUrl ? (
            <div className='relative h-36 w-36 shrink-0 overflow-hidden rounded-full bg-brand/15 ring-2 ring-border/80 shadow-elev1 md:h-44 md:w-44'>
              <Image
                className='object-cover'
                src={about.photoUrl}
                alt={`${about.displayName || "Author"} portrait`}
                fill
                priority
                sizes='176px'
                unoptimized={about.photoUrl.startsWith("http")}
              />
            </div>
          ) : null}
          <header className='flex flex-col gap-3'>
            <p className='accent-label'>About</p>
            <h1 className='display-title text-4xl md:text-5xl text-foreground'>
              {about.displayName || "About"}
            </h1>
            {about.title ? (
              <p className='text-lg text-foreground/80'>{about.title}</p>
            ) : null}
            {bioParagraphs.length > 0 ? (
              <div className='mx-auto flex max-w-xl flex-col gap-4 text-left text-muted-foreground leading-relaxed'>
                {bioParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            ) : null}
          </header>
        </div>
      </div>

      <main className='page-stack mx-auto w-full max-w-3xl px-4 py-10 md:py-14'>
        <section aria-labelledby='what-i-do' className='page-section'>
          <p className='accent-label mb-2'>Practice</p>
          <h2
            id='what-i-do'
            className='display-title text-2xl md:text-3xl mb-6'
          >
            What I do
          </h2>
          <ul className='m-0 list-disc space-y-3 pl-5 text-muted-foreground leading-relaxed'>
            {ABOUT_WHAT_I_DO.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {about.credentials.length > 0 ? (
          <section aria-labelledby='credentials' className='page-section'>
            <p className='accent-label mb-2'>Background</p>
            <h2
              id='credentials'
              className='display-title text-2xl md:text-3xl mb-6'
            >
              Credentials
            </h2>
            <CredentialsStrip credentials={about.credentials} />
          </section>
        ) : null}

        <section
          id='hiring'
          aria-labelledby='hiring-heading'
          className='page-section scroll-mt-24'
        >
          <p className='accent-label mb-2'>Hiring</p>
          <h2
            id='hiring-heading'
            className='display-title text-2xl md:text-3xl mb-3'
          >
            For hiring managers
          </h2>
          {about.hiringBlurb ? (
            <p className='text-muted-foreground leading-relaxed mb-5 max-w-xl'>
              {about.hiringBlurb}
            </p>
          ) : null}
          <div className='flex flex-wrap gap-3'>
            <a
              href={LINKEDIN_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='craft-cta-primary'
            >
              <Icons.FaLinkedin className='craft-cta-icon' aria-hidden />
              LinkedIn
            </a>
            <Link href='/work' className='craft-cta-secondary'>
              <Icons.FolderCode className='craft-cta-icon' aria-hidden />
              Work
            </Link>
          </div>
        </section>

        <section
          aria-labelledby='next-step'
          className='page-section life-panel'
        >
          <p className='accent-label mb-2'>Next</p>
          <h2 id='next-step' className='display-title text-2xl md:text-3xl mb-3'>
            Stay in touch
          </h2>
          <p className='mb-5 max-w-xl text-muted-foreground leading-relaxed'>
            Get new essays by email, or book a 30 minute call.
          </p>
          <div className='flex flex-wrap gap-3'>
            <Link href='/subscribe' className='craft-cta-primary'>
              <Icons.Mails className='craft-cta-icon' aria-hidden />
              Get new essays by email
            </Link>
            <a
              href={CALENDLY_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='craft-cta-secondary'
            >
              <Icons.FaCalendarDays className='craft-cta-icon' aria-hidden />
              {CTA.calendly}
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
