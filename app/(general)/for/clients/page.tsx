import { Metadata } from "next";
import Link from "next/link";
import AudienceShell from "@/components/audience/AudienceShell";
import CaseStudyCard from "@/components/work/CaseStudyCard";
import { CALENDLY_URL, CASE_STUDIES } from "@/lib/work";
import { LINKEDIN_URL } from "@/lib/audience";
import { CTA } from "@/lib/ctas";

export const metadata: Metadata = {
  title: "Explore the work | Syed Baqir Ali",
  description:
    "Delivery approach, outcomes, and selected case studies for project work.",
};

const outcomes = [
  {
    title: "Custom AI solutions",
    text: "Design and implement AI-powered applications. Generative AI, predictive analytics, and NLP tools, grounded in real product constraints.",
  },
  {
    title: "AI-driven customer experience",
    text: "Intelligent assistants and automated support that raise engagement without drowning your team in ops overhead.",
  },
  {
    title: "Cloud integration",
    text: "Modernize and migrate legacy systems to AWS, Azure, or GCP with room for AI workloads and lower infrastructure drag.",
  },
  {
    title: "DevOps and automation",
    text: "CI/CD, containers, and orchestration that shorten time-to-market and make releases boring in the best way.",
  },
];

const process = [
  {
    step: "01",
    title: "Listen & frame",
    text: "Clarify the outcome, constraints, and success metrics before any architecture pitch.",
  },
  {
    step: "02",
    title: "Build the thin slice",
    text: "Ship a credible vertical slice early. Proof over promises.",
  },
  {
    step: "03",
    title: "Harden & hand over",
    text: "Production readiness, docs, and a path your team can own.",
  },
];

export default function ForClientsPage() {
  const featured = CASE_STUDIES[0];

  return (
    <AudienceShell
      eyebrow='Explore the work'
      title='Outcomes over slide decks'
      description='Practical delivery across AI, cloud, and software systems. Writing that explains the why, not just the what.'
      ctas={[
        {
          href: "/contact",
          label: CTA.contact,
          variant: "primary",
          icon: "contact",
        },
        {
          href: CALENDLY_URL,
          label: CTA.calendly,
          external: true,
          variant: "secondary",
          icon: "calendar",
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
      <section aria-labelledby='outcomes' className='flex flex-col gap-6'>
        <div>
          <p className='accent-label mb-2'>Services</p>
          <h2 id='outcomes' className='display-title text-2xl md:text-3xl'>
            How I help
          </h2>
        </div>
        <ul className='grid gap-4 list-none p-0 m-0 sm:grid-cols-2'>
          {outcomes.map((o) => (
            <li
              key={o.title}
              className='rounded-2xl border border-border/80 bg-card p-5 shadow-elev1'
            >
              <h3 className='font-display font-semibold text-foreground mb-2'>
                {o.title}
              </h3>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                {o.text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby='process' className='life-panel'>
        <p className='accent-label mb-2'>Process</p>
        <h2 id='process' className='display-title text-2xl mb-6'>
          How engagements usually run
        </h2>
        <ol className='grid gap-6 list-none p-0 m-0 sm:grid-cols-3'>
          {process.map((p) => (
            <li key={p.step} className='flex flex-col gap-2'>
              <span className='text-xs font-bold uppercase tracking-[0.12em] text-brand'>
                {p.step}
              </span>
              <h3 className='font-display font-semibold'>{p.title}</h3>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                {p.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {featured && (
        <section aria-labelledby='featured-work' className='flex flex-col gap-4'>
          <div>
            <p className='accent-label mb-2'>Case study</p>
            <h2 id='featured-work' className='display-title text-2xl md:text-3xl'>
              Featured work
            </h2>
          </div>
          <div className='rounded-2xl border border-border/80 bg-card p-5 shadow-elev1'>
            <CaseStudyCard study={featured} />
          </div>
        </section>
      )}

      <p className='text-sm text-muted-foreground'>
        Prefer to read first?{" "}
        <Link
          href='/writing'
          className='text-brand font-medium underline-offset-4 hover:underline'
        >
          Browse Writing
        </Link>
      </p>
    </AudienceShell>
  );
}
