import { Metadata } from "next";
import Link from "next/link";
import AudienceShell from "@/components/audience/AudienceShell";
import CaseStudyCard from "@/components/work/CaseStudyCard";
import CredentialsStrip from "@/components/CredentialsStrip";
import JsonLd from "@/components/JsonLd";
import {
  CALENDLY_URL,
  getAboutConfig,
  getWorkProjects,
} from "@/lib/work";
import { pageMeta, professionalServiceJsonLd } from "@/lib/seo";
import { CTA } from "@/lib/ctas";
import { SERVICE_ACCENT_CLASS, SERVICE_OFFERINGS } from "@/lib/services";
import { LINKEDIN_URL } from "@/lib/audience";

export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: "Work with me",
  description:
    "Book a 30 minute call. AI, cloud, case studies, and book review or authoring for publishers.",
  path: "/work-with-me",
});

export default async function WorkWithMePage() {
  const [studies, about] = await Promise.all([
    getWorkProjects(),
    getAboutConfig(),
  ]);

  return (
    <>
      <JsonLd data={professionalServiceJsonLd()} />
      <AudienceShell
        eyebrow='Clients'
        title='What I offer'
        description='AI product slices, cloud integration, and book review or authoring for publishers. Shipped outcomes, not slide decks.'
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
        <section
          aria-labelledby='outcomes'
          className='page-section flex flex-col gap-6'
        >
          <div>
            <p className='accent-label mb-2'>Services</p>
            <h2 id='outcomes' className='display-title text-2xl md:text-3xl'>
              How I help
            </h2>
            <p className='mt-2 max-w-xl text-muted-foreground'>
              Each offer lists who it is for, what you get, and related work on
              this site.
            </p>
          </div>
          <ul className='m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2'>
            {SERVICE_OFFERINGS.map((o) => (
              <li
                key={o.slug}
                id={o.slug}
                className={`scroll-mt-24 rounded-2xl border border-border/80 border-l-4 p-5 shadow-elev1 ${SERVICE_ACCENT_CLASS[o.accent]}`}
              >
                <p className='mb-2 font-display text-xs font-semibold tracking-widest text-muted-foreground'>
                  {o.indexLabel}
                </p>
                <h3 className='mb-3 font-display text-lg font-semibold text-foreground'>
                  {o.title}
                </h3>
                <dl className='m-0 flex flex-col gap-2 text-sm leading-relaxed'>
                  <div>
                    <dt className='font-semibold text-foreground'>For</dt>
                    <dd className='m-0 text-muted-foreground'>{o.forWhom}</dd>
                  </div>
                  <div>
                    <dt className='font-semibold text-foreground'>Problem</dt>
                    <dd className='m-0 text-muted-foreground'>{o.problem}</dd>
                  </div>
                  <div>
                    <dt className='font-semibold text-foreground'>Deliver</dt>
                    <dd className='m-0 text-muted-foreground'>{o.deliver}</dd>
                  </div>
                  <div>
                    <dt className='font-semibold text-foreground'>Related work</dt>
                    <dd className='m-0 flex flex-wrap gap-x-3 gap-y-1 text-muted-foreground'>
                      {o.related.map((r) => (
                        <Link
                          key={r.href + r.label}
                          href={r.href}
                          className='font-semibold text-brand underline-offset-4 hover:underline'
                        >
                          {r.label}
                        </Link>
                      ))}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby='why-trust'
          className='page-section flex flex-col gap-6'
        >
          <div>
            <p className='accent-label mb-2'>Credentials</p>
            <h2 id='why-trust' className='display-title text-2xl md:text-3xl'>
              Why teams hire me
            </h2>
            <p className='mt-2 max-w-xl text-muted-foreground'>
              {about.title} 25+ years in software engineering. Essays, shipped
              products, and practical delivery for teams.
            </p>
          </div>
          <CredentialsStrip credentials={about.credentials} />
        </section>

        <section
          aria-labelledby='offer-summary'
          className='page-section page-section-band flex flex-col gap-5'
        >
          <div>
            <p className='accent-label mb-2'>In short</p>
            <h2 id='offer-summary' className='display-title text-2xl md:text-3xl'>
              Three ways to start
            </h2>
          </div>
          <ol className='m-0 grid list-none gap-5 p-0 sm:grid-cols-3 sm:gap-6'>
            <li>
              <p className='font-display font-semibold text-foreground'>1. Book a call</p>
              <p className='mt-1 text-sm leading-relaxed text-muted-foreground'>
                A 30 minute call to frame the outcome.
              </p>
            </li>
            <li>
              <p className='font-display font-semibold text-foreground'>2. Scope a thin slice</p>
              <p className='mt-1 text-sm leading-relaxed text-muted-foreground'>
                One service above, sized to prove value before a larger build.
              </p>
            </li>
            <li>
              <p className='font-display font-semibold text-foreground'>3. Or write first</p>
              <p className='mt-1 text-sm leading-relaxed text-muted-foreground'>
                Prefer email? Use{" "}
                <Link
                  href='/contact'
                  className='font-semibold text-brand underline-offset-4 hover:underline'
                >
                  Contact
                </Link>{" "}
                with reason Project.
              </p>
            </li>
          </ol>
        </section>

        <section
          aria-labelledby='proof'
          className='page-section flex flex-col gap-6'
        >
          <div>
            <p className='accent-label mb-2'>Proof</p>
            <h2 id='proof' className='display-title text-2xl md:text-3xl'>
              Featured work and recommendations
            </h2>
            <p className='mt-2 max-w-xl text-muted-foreground'>
              Cobu and Blox are live product showcases: problem, approach, and
              outcome for each. Recommendations are on{" "}
              <a
                href={LINKEDIN_URL}
                target='_blank'
                rel='noopener noreferrer'
                className='font-semibold text-brand underline-offset-4 hover:underline'
              >
                LinkedIn
              </a>
              .
            </p>
          </div>
          <ul className='m-0 grid list-none gap-4 p-0 sm:grid-cols-2'>
            {studies.map((study) => (
              <li key={study.slug}>
                <CaseStudyCard study={study} />
              </li>
            ))}
          </ul>
          <div className='flex flex-wrap gap-x-5 gap-y-2'>
            <Link
              href='/work'
              className='w-fit font-semibold text-brand underline-offset-4 hover:underline'
            >
              All case studies
            </Link>
            <a
              href='https://www.amazon.com.au/stores/Syed-Baqir-Ali/author/B0G81DNV2T'
              target='_blank'
              rel='noopener noreferrer'
              className='w-fit font-semibold text-brand underline-offset-4 hover:underline'
            >
              Amazon author page
            </a>
          </div>
        </section>

        <section
          id='get-in-touch'
          aria-labelledby='engagement'
          className='page-section life-panel scroll-mt-24'
        >
          <p className='accent-label mb-2'>Get in touch</p>
          <h2 id='engagement' className='display-title mb-3 text-2xl'>
            Next step
          </h2>
          <p className='mb-5 max-w-xl leading-relaxed text-muted-foreground'>
            Book a call on Calendly, or send a short note with your goal and
            constraints. I read every message.
          </p>
          <div className='flex flex-wrap gap-3'>
            <a
              href={CALENDLY_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='craft-cta-primary w-fit'
            >
              {CTA.calendly}
            </a>
            <Link href='/contact' className='craft-cta-secondary w-fit'>
              {CTA.contact}
            </Link>
          </div>
        </section>
      </AudienceShell>
    </>
  );
}
