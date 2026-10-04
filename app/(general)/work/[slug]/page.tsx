import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CaseStudySummary from "@/components/CaseStudySummary";
import AuthorBox from "@/components/AuthorBox";
import SubscribeForm from "@/components/SubscribeForm";
import JsonLd from "@/components/JsonLd";
import { getWorkProject } from "@/lib/work";
import { breadcrumbJsonLd, pageMeta, projectJsonLd } from "@/lib/seo";
import { CTA } from "@/lib/ctas";
import { SUBSCRIBE } from "@/lib/copy";
import "@/app/(blog)/writing/[slug]/article.css";

type Params = Promise<{ slug: string }>;

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = await getWorkProject(slug);
  if (!study) return {};
  return pageMeta({
    title: study.title,
    description: study.tagline,
    path: `/work/${slug}`,
    // null: use route opengraph-image.tsx (branded OG), not the static fallback.
    image: study.mark?.startsWith("http") ? study.mark : null,
  });
}

export default async function CaseStudyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const study = await getWorkProject(slug);
  if (!study) notFound();

  return (
    <main className='mx-auto w-full max-w-3xl px-4 py-12 md:py-16'>
      <JsonLd
        data={projectJsonLd({
          title: study.title,
          description: study.tagline,
          path: `/work/${slug}`,
          image: study.mark?.startsWith("http") ? study.mark : undefined,
          externalUrl: study.externalUrl,
          dateCreated: study.timeline,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: study.title, path: `/work/${slug}` },
        ])}
      />
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

      <header className='mb-8 flex flex-col gap-6 sm:flex-row sm:items-start'>
        <div className='relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-secondary ring-1 ring-border/80 shadow-elev1 sm:mx-0'>
          <Image
            src={study.mark}
            alt={`${study.title} product mark`}
            fill
            priority
            className='object-cover'
            sizes='112px'
          />
        </div>
        <div className='flex flex-col gap-3 text-center sm:text-left'>
          <p className='accent-label'>Case study</p>
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
              className='text-brand font-medium underline-offset-4 hover:underline w-fit mx-auto sm:mx-0 min-h-11 inline-flex items-center'
            >
              Visit live product
            </a>
          )}
        </div>
      </header>

      <div className='mb-12'>
        <CaseStudySummary study={study} />
      </div>

      <div className='article-prose flex max-w-none flex-col gap-12'>
        <section aria-labelledby='problem'>
          <h2 id='problem'>Problem</h2>
          <p>{study.problem}</p>
        </section>

        <section aria-labelledby='approach'>
          <h2 id='approach'>Approach</h2>
          <ul>
            {study.approach.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby='outcome'>
          <h2 id='outcome'>Outcome</h2>
          <ul>
            {study.outcome.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <aside className='mt-16 flex max-w-xl flex-col gap-4 border-t border-border pt-10'>
        <p className='accent-label'>{SUBSCRIBE.eyebrow}</p>
        <h2 className='display-title text-2xl md:text-3xl'>{SUBSCRIBE.heading}</h2>
        <p className='leading-relaxed text-muted-foreground'>{SUBSCRIBE.blurb}</p>
        <SubscribeForm variant='end' submitLabel={CTA.subscribe} />
      </aside>

      <div className='mt-12'>
        <AuthorBox />
      </div>

      <footer className='mt-12 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between'>
        <Link
          href='/work'
          className='inline-flex min-h-11 items-center text-sm text-muted-foreground underline-offset-4 hover:text-brand hover:underline'
        >
          All work
        </Link>
        <div className='flex flex-wrap gap-3'>
          <Link
            href='/work-with-me'
            className='inline-flex min-h-11 items-center text-sm text-brand underline-offset-4 hover:underline'
          >
            Work with me
          </Link>
          <Link
            href='/contact'
            className='inline-flex min-h-11 items-center text-sm text-muted-foreground underline-offset-4 hover:underline'
          >
            Contact
          </Link>
        </div>
      </footer>
    </main>
  );
}
