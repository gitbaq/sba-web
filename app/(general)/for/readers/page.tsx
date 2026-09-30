import { Metadata } from "next";
import Link from "next/link";
import AudienceShell from "@/components/audience/AudienceShell";
import LatestWriting from "@/components/home/LatestWriting";
import {
  getAllSubtopicsSorted,
  getLatestSubtopics,
} from "@/utils/services/getLatestSubtopics";
import { articleHref, estimateReadingMinutes } from "@/lib/articles";
import { LINKEDIN_URL } from "@/lib/audience";
import { CTA } from "@/lib/ctas";

export const metadata: Metadata = {
  title: "Read the essays | Syed Baqir Ali",
  description:
    "Research-depth writing on AI and software. Thorough, practical, newest first.",
};

const habits = [
  {
    title: "One careful piece a week",
    text: "Cadence over firehose. Essays meant to be finished, not skimmed forever.",
  },
  {
    title: "Depth without opacity",
    text: "Research-backed, still readable. Tables of contents and reading time help you plan.",
  },
  {
    title: "Stand alone, then connect",
    text: "Each essay works on its own; series and related links appear when useful.",
  },
];

export default async function ForReadersPage() {
  const posts = await getLatestSubtopics(5);
  const all = await getAllSubtopicsSorted();
  const startHere = all.slice(0, 3);

  return (
    <AudienceShell
      eyebrow='Read the essays'
      title='Read deeply. Stay curious.'
      description='Essays are written to be thorough without being opaque. One carefully researched piece most weeks.'
      ctas={[
        {
          href: "/subscribe",
          label: CTA.subscribe,
          variant: "primary",
          icon: "mail",
        },
        {
          href: "/writing",
          label: CTA.writing,
          variant: "secondary",
          icon: "writing",
        },
        {
          href: LINKEDIN_URL,
          label: CTA.linkedin,
          external: true,
          variant: "secondary",
          icon: "linkedin",
        },
      ]}
    >
      <section aria-labelledby='how-to-read' className='flex flex-col gap-6'>
        <div>
          <p className='accent-label mb-2'>Library</p>
          <h2 id='how-to-read' className='display-title text-2xl md:text-3xl'>
            How this library works
          </h2>
        </div>
        <ul className='grid gap-4 list-none p-0 m-0'>
          {habits.map((h) => (
            <li
              key={h.title}
              className='rounded-2xl border border-border/80 bg-card p-5 shadow-elev1'
            >
              <h3 className='font-display font-semibold mb-2'>{h.title}</h3>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                {h.text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby='start-here' className='flex flex-col gap-6'>
        <div>
          <p className='accent-label mb-2'>Start here</p>
          <h2 id='start-here' className='display-title text-2xl md:text-3xl'>
            A short entry path
          </h2>
          <p className='text-muted-foreground mt-2 max-w-xl'>
            Then explore the full index.
          </p>
        </div>
        <ol className='flex flex-col gap-3 list-none p-0 m-0'>
          {startHere.map((post, i) => (
            <li key={post.id}>
              <Link
                href={articleHref(post)}
                className='group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-elev1 hover:border-brand/40 hover:no-underline transition-colors'
              >
                <span className='text-sm font-bold text-brand tabular-nums sm:w-8'>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className='flex-1'>
                  <span className='block font-display text-lg font-semibold group-hover:text-brand transition-colors'>
                    {post.subHeading || post.heading}
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    {estimateReadingMinutes(post.content || "")} min ·{" "}
                    {post.heading}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <LatestWriting posts={posts} title='Recent' />
      </section>
    </AudienceShell>
  );
}
