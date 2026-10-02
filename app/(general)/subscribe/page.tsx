import { Metadata } from "next";
import Link from "next/link";
import SubscribeForm from "@/components/SubscribeForm";
import LatestWriting from "@/components/home/LatestWriting";
import { getLatestSubtopics } from "@/utils/services/getLatestSubtopics";
import { pageMeta } from "@/lib/seo";
import { CTA } from "@/lib/ctas";

export const metadata: Metadata = pageMeta({
  title: "Subscribe",
  description:
    "Get new essays by email. AI, software systems, and engineering leadership. Unsubscribe anytime.",
  path: "/subscribe",
});

const perks = [
  "New essays as they publish",
  "AI, software systems, and engineering leadership",
  "Unsubscribe anytime",
];

export default async function SubscribePage() {
  const posts = await getLatestSubtopics(3);

  return (
    <div className='w-full'>
      <div className='life-hero'>
        <header className='relative z-[2] mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 pt-6 pb-12 md:pt-8 md:pb-16'>
          <p className='accent-label'>Newsletter</p>
          <h1 className='display-title text-4xl text-foreground md:text-5xl'>
            Get new essays by email
          </h1>
          <p className='max-w-xl text-lg leading-relaxed text-foreground/80'>
            Occasional email when something new ships. Prefer feeds? Use RSS.
          </p>
        </header>
      </div>

      <main className='mx-auto flex w-full max-w-3xl flex-col gap-14 px-4 py-10 md:py-14'>
        <section className='life-panel flex flex-col gap-6'>
          <ul className='m-0 flex list-none flex-col gap-2.5 p-0'>
            {perks.map((p) => (
              <li
                key={p}
                className='flex gap-2.5 text-sm leading-relaxed text-muted-foreground'
              >
                <span className='shrink-0 font-semibold text-brand' aria-hidden>
                  ✓
                </span>
                {p}
              </li>
            ))}
          </ul>

          <SubscribeForm submitLabel={CTA.subscribe} />

          <p className='text-sm text-muted-foreground'>
            Prefer RSS?{" "}
            <a
              href='/feed.xml'
              className='font-medium text-brand underline-offset-4 hover:underline'
            >
              Subscribe to the feed
            </a>
            {" · "}
            <Link
              href='/writing'
              className='underline-offset-4 hover:text-brand hover:underline'
            >
              Browse Writing
            </Link>
          </p>
        </section>

        {posts.length > 0 && (
          <LatestWriting posts={posts} title='Recent essays' showViewAll />
        )}
      </main>
    </div>
  );
}
