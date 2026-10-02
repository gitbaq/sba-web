import { Metadata } from "next";
import Link from "next/link";
import AudienceShell from "@/components/audience/AudienceShell";
import CaseStudyCard from "@/components/work/CaseStudyCard";
import { CALENDLY_URL, getWorkProjects } from "@/lib/work";
import { pageMeta } from "@/lib/seo";
import { CTA } from "@/lib/ctas";

export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: "Work with me",
  description:
    "Book a 30 minute call. Delivery across AI, cloud, and software systems, with selected case studies.",
  path: "/for/clients",
});

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
    title: "Listen and frame",
    text: "Clarify the outcome, constraints, and success metrics before any architecture pitch.",
  },
  {
    step: "02",
    title: "Build the thin slice",
    text: "Ship a credible vertical slice early. Proof over promises.",
  },
  {
    step: "03",
    title: "Harden and hand over",
    text: "Production readiness, docs, and a path your team can own.",
  },
];

export default async function ForClientsPage() {
  const studies = await getWorkProjects();

  return (
    <AudienceShell
      eyebrow='Clients'
      title='Outcomes over slide decks'
      description='Practical delivery across AI, cloud, and software systems. Writing that explains the why, not just the what.'
      ctas={[
        {
          href: CALENDLY_URL,
          label: CTA.calendly,
          external: true,
          variant: "primary",
          icon: "calendar",
        },
        {
          href: "/contact",
          label: CTA.contact,
          variant: "secondary",
          icon: "contact",
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
        <ul className='m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2'>
          {outcomes.map((o) => (
            <li
              key={o.title}
              className='rounded-2xl border border-border/80 bg-card p-5 shadow-elev1'
            >
              <h3 className='mb-2 font-display font-semibold text-foreground'>
                {o.title}
              </h3>
              <p className='text-sm leading-relaxed text-muted-foreground'>
                {o.text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby='process' className='flex flex-col gap-6'>
        <div>
          <p className='accent-label mb-2'>Process</p>
          <h2 id='process' className='display-title text-2xl md:text-3xl'>
            How engagements run
          </h2>
        </div>
        <ol className='m-0 grid list-none gap-4 p-0 sm:grid-cols-3'>
          {process.map((p) => (
            <li key={p.step} className='flex flex-col gap-2'>
              <span className='font-display text-sm font-semibold text-brand'>
                {p.step}
              </span>
              <h3 className='font-display text-lg font-semibold'>{p.title}</h3>
              <p className='text-sm leading-relaxed text-muted-foreground'>
                {p.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby='proof' className='flex flex-col gap-6'>
        <div>
          <p className='accent-label mb-2'>Proof</p>
          <h2 id='proof' className='display-title text-2xl md:text-3xl'>
            Featured work
          </h2>
          <p className='mt-2 max-w-xl text-muted-foreground'>
            Cobu and Blox. Case studies with problem, approach, and outcome.
          </p>
        </div>
        <ul className='m-0 grid list-none gap-4 p-0 sm:grid-cols-2'>
          {studies.map((study) => (
            <li key={study.slug}>
              <CaseStudyCard study={study} />
            </li>
          ))}
        </ul>
        <Link
          href='/work'
          className='w-fit font-semibold text-brand underline-offset-4 hover:underline'
        >
          All case studies
        </Link>
      </section>

      <section aria-labelledby='engagement' className='life-panel'>
        <p className='accent-label mb-2'>Engagement</p>
        <h2 id='engagement' className='display-title text-2xl mb-3'>
          How we work together
        </h2>
        <p className='text-muted-foreground leading-relaxed max-w-xl mb-5'>
          Book a paid consultation on Calendly. We use that call to frame the
          outcome, then scope a thin slice before a larger build.
        </p>
        <a
          href={CALENDLY_URL}
          target='_blank'
          rel='noopener noreferrer'
          className='craft-cta-primary w-fit'
        >
          {CTA.calendly}
        </a>
      </section>
    </AudienceShell>
  );
}
