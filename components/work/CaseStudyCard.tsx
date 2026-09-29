import Link from "next/link";
import Image from "next/image";
import { CaseStudy } from "@/lib/work";

export default function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <article className='group flex h-full flex-col sm:flex-row sm:items-start gap-5 sm:gap-6'>
      <Link
        href={study.href}
        className='relative mx-auto sm:mx-0 h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-secondary ring-1 ring-border/80 shadow-elev1 transition-transform duration-200 group-hover:scale-[1.03] motion-reduce:transition-none'
      >
        <Image
          src={study.mark}
          alt={`${study.title} mark`}
          fill
          className='object-cover'
          sizes='96px'
        />
      </Link>

      <div className='flex flex-1 flex-col gap-3 text-center sm:text-left'>
        <div className='flex flex-col gap-2'>
          <h2 className='display-title text-2xl md:text-[1.75rem] text-foreground'>
            <Link
              href={study.href}
              className='transition-colors hover:text-brand hover:no-underline'
            >
              {study.title}
            </Link>
          </h2>
          <p className='text-muted-foreground leading-relaxed text-[0.95rem]'>
            {study.tagline}
          </p>
        </div>

        <p className='text-xs text-muted-foreground tracking-wide'>
          {study.stack.slice(0, 3).join(" · ")}
        </p>

        <Link
          href={study.href}
          className='mt-auto pt-1 text-sm font-medium text-brand underline-offset-4 hover:underline w-fit mx-auto sm:mx-0'
        >
          Case study
        </Link>
      </div>
    </article>
  );
}
