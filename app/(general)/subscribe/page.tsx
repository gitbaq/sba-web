import { Metadata } from "next";
import Link from "next/link";
import SubscribeForm from "@/components/SubscribeForm";
import LatestWriting from "@/components/home/LatestWriting";
import { getLatestSubtopics } from "@/utils/services/getLatestSubtopics";

export const metadata: Metadata = {
  title: "Subscribe | Syed Baqir Ali",
  description:
    "Get researched essays on AI and software by email. Roughly one careful piece a week. Also available via RSS.",
};

const perks = [
  "About one researched essay most weeks. Not a daily firehose",
  "Topics: AI, software systems, and building in public",
  "Unsubscribe anytime; no spam",
];

export default async function SubscribePage() {
  const posts = await getLatestSubtopics(3);

  return (
    <div className='w-full'>
      <div className='life-hero'>
        <header className='relative z-[2] mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 pt-6 pb-12 md:pt-8 md:pb-16'>
          <p className='accent-label'>Newsletter</p>
          <h1 className='display-title text-4xl md:text-5xl text-foreground'>
            Subscribe
          </h1>
          <p className='text-lg leading-relaxed text-foreground/80 max-w-xl'>
            Occasional email when something new and worthwhile ships. Prefer
            feeds? Use RSS. Same writing, your reader.
          </p>
        </header>
      </div>

      <main className='mx-auto flex w-full max-w-3xl flex-col gap-14 px-4 py-10 md:py-14'>
        <section className='life-panel flex flex-col gap-6'>
          <ul className='flex flex-col gap-2.5 list-none p-0 m-0'>
            {perks.map((p) => (
              <li
                key={p}
                className='flex gap-2.5 text-sm text-muted-foreground leading-relaxed'
              >
                <span className='text-brand font-semibold shrink-0' aria-hidden>
                  ✓
                </span>
                {p}
              </li>
            ))}
          </ul>

          <SubscribeForm submitLabel='Get Weekly Insights' />

          <p className='text-sm text-muted-foreground'>
            Prefer RSS?{" "}
            <a
              href='/feed.xml'
              className='text-brand font-medium underline-offset-4 hover:underline'
            >
              Subscribe to the feed
            </a>
            {" · "}
            <Link
              href='/writing'
              className='underline-offset-4 hover:underline hover:text-brand'
            >
              Browse Writing
            </Link>
          </p>
        </section>

        {posts.length > 0 && (
          <LatestWriting
            posts={posts}
            title='Recent essays'
            showViewAll
          />
        )}
      </main>
    </div>
  );
}
