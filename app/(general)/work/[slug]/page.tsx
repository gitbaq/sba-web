import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCaseStudy } from "@/lib/work";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: `${study.title} — Work`,
    description: study.tagline,
  };
}

export default async function CaseStudyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <main className='mx-auto w-full max-w-3xl px-4 py-12 md:py-16'>
      <nav
        aria-label='Breadcrumb'
        className='mb-8 text-sm text-muted-foreground'
      >
        <Link
          href='/work'
          className='hover:text-brand underline-offset-4 hover:underline'
        >
          Work
        </Link>
        <span aria-hidden className='mx-2'>
          /
        </span>
        <span className='text-foreground'>{study.title}</span>
      </nav>

      <header className='mb-12 flex flex-col gap-6 sm:flex-row sm:items-start'>
        <div className='relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-secondary ring-1 ring-border/80 shadow-elev1 sm:mx-0'>
          <Image
            src={study.mark}
            alt={`${study.title} mark`}
            fill
            priority
            className='object-cover'
            sizes='112px'
          />
        </div>
        <div className='flex flex-col gap-3 text-center sm:text-left'>
          <p className='text-[11px] uppercase tracking-[0.14em] text-brand font-semibold'>
            Case study
          </p>
          <h1 className='display-title text-4xl md:text-5xl text-foreground'>
            {study.title}
          </h1>
          <p className='text-lg text-muted-foreground leading-relaxed max-w-xl'>
            {study.tagline}
          </p>
          {study.externalUrl && (
            <a
              href={study.externalUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-brand font-medium underline-offset-4 hover:underline w-fit mx-auto sm:mx-0'
            >
              Visit live product
            </a>
          )}
        </div>
      </header>

      <div className='flex flex-col gap-12'>
        <section aria-labelledby='problem'>
          <h2 id='problem' className='font-display text-2xl mb-3'>
            Problem
          </h2>
          <p className='text-muted-foreground leading-relaxed'>
            {study.problem}
          </p>
        </section>

        <section aria-labelledby='approach'>
          <h2 id='approach' className='font-display text-2xl mb-3'>
            Approach
          </h2>
          <ul className='list-disc pl-5 space-y-2 text-muted-foreground'>
            {study.approach.map((item) => (
              <li key={item} className='leading-relaxed'>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby='outcome'>
          <h2 id='outcome' className='font-display text-2xl mb-3'>
            Outcome
          </h2>
          <ul className='list-disc pl-5 space-y-2 text-muted-foreground'>
            {study.outcome.map((item) => (
              <li key={item} className='leading-relaxed'>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby='stack'>
          <h2 id='stack' className='font-display text-2xl mb-4'>
            Stack &amp; craft
          </h2>
          <p className='text-sm text-muted-foreground tracking-wide'>
            {study.stack.join(" · ")}
          </p>
        </section>
      </div>

      <footer className='mt-16 pt-8 border-t border-border flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between'>
        <Link
          href='/work'
          className='text-sm text-muted-foreground hover:text-brand underline-offset-4 hover:underline'
        >
          ← All work
        </Link>
        <div className='flex flex-wrap gap-3'>
          <Link
            href='/for/clients'
            className='text-sm text-brand underline-offset-4 hover:underline'
          >
            Work with me
          </Link>
          <Link
            href='/contact'
            className='text-sm text-muted-foreground underline-offset-4 hover:underline'
          >
            Contact
          </Link>
        </div>
      </footer>
    </main>
  );
}
