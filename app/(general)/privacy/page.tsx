import { Metadata } from "next";
import Link from "next/link";
import { pageMeta, SITE } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Privacy",
  description:
    "How syedbaqirali.com handles contact form and newsletter data. Plain language.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className='w-full'>
      <div className='life-hero'>
        <header className='relative z-[2] mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 pt-6 pb-12 md:pt-8 md:pb-16'>
          <p className='accent-label'>Legal</p>
          <h1 className='display-title text-4xl text-foreground md:text-5xl'>
            Privacy
          </h1>
          <p className='max-w-xl text-lg leading-relaxed text-foreground/80'>
            Short version: I collect only what I need to reply or send essays you
            asked for.
          </p>
        </header>
      </div>

      <main className='mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-10 md:py-14'>
        <section className='flex flex-col gap-3'>
          <h2 className='display-title text-2xl'>Contact form</h2>
          <p className='leading-relaxed text-muted-foreground'>
            When you submit the contact form, I store your email, subject,
            reason, and message so I can reply. I do not sell this data.
          </p>
        </section>

        <section className='flex flex-col gap-3'>
          <h2 className='display-title text-2xl'>Newsletter</h2>
          <p className='leading-relaxed text-muted-foreground'>
            If you subscribe, I store your email to send new essays. You can
            unsubscribe at any time. I do not share the list with third parties
            for marketing.
          </p>
        </section>

        <section className='flex flex-col gap-3'>
          <h2 className='display-title text-2xl'>Analytics</h2>
          <p className='leading-relaxed text-muted-foreground'>
            The site may use privacy-respecting analytics to understand traffic.
            No sale of personal data.
          </p>
        </section>

        <section className='flex flex-col gap-3'>
          <h2 className='display-title text-2xl'>Contact</h2>
          <p className='leading-relaxed text-muted-foreground'>
            Questions about this policy:{" "}
            <a
              href={`mailto:${SITE.email}`}
              className='font-medium text-brand underline-offset-4 hover:underline'
            >
              {SITE.email}
            </a>{" "}
            or the{" "}
            <Link
              href='/contact'
              className='font-medium text-brand underline-offset-4 hover:underline'
            >
              contact form
            </Link>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
