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

      <main className='page-stack mx-auto w-full max-w-3xl px-4 py-10 md:py-14'>
        <section className='page-section flex flex-col gap-3'>
          <h2 className='display-title text-2xl'>Contact form</h2>
          <p className='leading-relaxed text-muted-foreground'>
            When you submit the contact form, I store your email, reason
            (Project, Role, Question about writing, Feature request, Site
            feedback, or Other), subject, and
            message so I can reply. Spam checks may use Cloudflare Turnstile. I
            do not sell this data.
          </p>
        </section>

        <section className='page-section flex flex-col gap-3'>
          <h2 className='display-title text-2xl'>Newsletter</h2>
          <p className='leading-relaxed text-muted-foreground'>
            If you subscribe, I store your email and the page you subscribed from
            after a double opt-in confirmation. I use that to send new essays and
            a welcome message. You can unsubscribe at any time via the link in
            every email. I do not share the list with third parties for marketing.
          </p>
        </section>

        <section className='page-section flex flex-col gap-3'>
          <h2 className='display-title text-2xl'>Analytics and ads</h2>
          <p className='leading-relaxed text-muted-foreground'>
            The site uses Google Analytics 4 for traffic, Vercel Analytics and
            Speed Insights for performance, and may show Google AdSense ads. These
            providers may set cookies or similar identifiers per their policies.
            No sale of personal data by me.
          </p>
        </section>

        <section className='page-section flex flex-col gap-3'>
          <h2 className='display-title text-2xl'>Contact</h2>
          <p className='leading-relaxed text-muted-foreground'>
            Questions about this policy: use the{" "}
            <Link
              href='/contact'
              className='font-medium text-brand underline-offset-4 hover:underline'
            >
              contact form
            </Link>{" "}
            or email the address listed as {SITE.email} on that page.
          </p>
        </section>
      </main>
    </div>
  );
}
