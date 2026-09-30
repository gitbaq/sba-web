import { Metadata } from "next";
import Link from "next/link";
import { LINKEDIN_URL } from "@/lib/audience";
import { CTA } from "@/lib/ctas";
import { CREDENTIAL_LINKS } from "@/lib/work";
import AudienceShell from "@/components/audience/AudienceShell";
import LatestWriting from "@/components/home/LatestWriting";
import { getLatestSubtopics } from "@/utils/services/getLatestSubtopics";

export const metadata: Metadata = {
  title: "Review for a role | Syed Baqir Ali",
  description:
    "Background, writing samples, and systems approach for role evaluation.",
};

const signals = [
  {
    title: "Communication under complexity",
    text: "Writing that makes AI and systems topics accurate without gatekeeping. A proxy for how I explain trade-offs in interviews and on teams.",
  },
  {
    title: "Builder’s instinct",
    text: "Shipped product work (Cobu, Blox) alongside research-depth essays. Not slides detached from delivery.",
  },
  {
    title: "Architecture & AI literacy",
    text: "Comfort across cloud, DevOps, and applied AI. Enough depth to challenge. Enough clarity to align stakeholders.",
  },
];

export default async function ForHiringPage() {
  const posts = await getLatestSubtopics(4);

  return (
    <AudienceShell
      eyebrow='Review for a role'
      title='Clarity on how I think and build'
      description='I write and ship at the intersection of AI, cloud, and product engineering. Use the materials below to assess depth, communication, and fit. Reach out if there is a match.'
      ctas={[
        {
          href: "/contact",
          label: CTA.contact,
          variant: "primary",
          icon: "contact",
        },
        {
          href: "/writing",
          label: CTA.writing,
          variant: "secondary",
          icon: "writing",
        },
        { href: "/work", label: CTA.work, variant: "secondary", icon: "work" },
        {
          href: LINKEDIN_URL,
          label: CTA.linkedin,
          external: true,
          variant: "secondary",
          icon: "linkedin",
        },
      ]}
    >
      <section aria-labelledby='signals' className='flex flex-col gap-6'>
        <div>
          <p className='accent-label mb-2'>Signals</p>
          <h2 id='signals' className='display-title text-2xl md:text-3xl'>
            What to look for
          </h2>
        </div>
        <ul className='grid gap-4 list-none p-0 m-0 sm:grid-cols-1'>
          {signals.map((s) => (
            <li
              key={s.title}
              className='rounded-2xl border border-border/80 bg-card p-5 shadow-elev1'
            >
              <h3 className='font-display font-semibold text-foreground mb-2'>
                {s.title}
              </h3>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                {s.text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby='credentials' className='life-panel'>
        <p className='accent-label mb-2'>Links</p>
        <h2 id='credentials' className='display-title text-2xl mb-4'>
          Quick links
        </h2>
        <ul className='flex flex-wrap gap-x-4 gap-y-2 list-none p-0 m-0 text-sm'>
          {CREDENTIAL_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target='_blank'
                rel='noopener noreferrer'
                className='text-brand font-medium underline-offset-4 hover:underline'
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              href='/work'
              className='text-brand font-medium underline-offset-4 hover:underline'
            >
              Work case studies
            </Link>
          </li>
          <li>
            <Link
              href='/about'
              className='text-muted-foreground underline-offset-4 hover:underline'
            >
              About
            </Link>
          </li>
        </ul>
      </section>

      <LatestWriting posts={posts} title='Signal pieces' />
    </AudienceShell>
  );
}
