import { Metadata } from "next";
import Link from "next/link";
import CaseStudyCard from "@/components/work/CaseStudyCard";
import { CASE_STUDIES } from "@/lib/work";

export const metadata: Metadata = {
  title: "Work | Syed Baqir Ali",
  description:
    "Case studies and products: Cobu, Blox, and more. Problem, approach, outcome, and stack.",
};

export default function WorkPage() {
  return (
    <div className='w-full'>
      <div className='life-hero'>
        <header className='relative z-[2] mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 pt-6 pb-12 md:pt-8 md:pb-16'>
          <p className='accent-label'>Portfolio</p>
          <h1 className='display-title text-4xl md:text-5xl text-foreground'>
            Work
          </h1>
          <p className='text-lg leading-relaxed text-foreground/80 max-w-xl'>
            Selected products. How the problem was framed, what shipped, and
            what changed. Essays live on{" "}
            <Link
              href='/writing'
              className='text-brand font-medium underline-offset-4 hover:underline'
            >
              Writing
            </Link>
            .
          </p>
        </header>
      </div>

      <main className='mx-auto w-full max-w-3xl px-4 py-10 md:py-14'>
        <ul className='grid list-none grid-cols-1 gap-8 p-0 m-0 sm:grid-cols-2 sm:gap-6'>
          {CASE_STUDIES.map((study) => (
            <li
              key={study.slug}
              className='min-w-0 rounded-2xl border border-border/80 bg-card p-5 shadow-elev1'
            >
              <CaseStudyCard study={study} />
            </li>
          ))}
        </ul>

        <p className='mt-12 life-panel text-sm text-muted-foreground leading-relaxed'>
          Looking for delivery help?{" "}
          <Link
            href='/for/clients'
            className='text-brand font-semibold underline-offset-4 hover:underline'
          >
            How I work with clients
          </Link>
          {" · "}
          <Link
            href='/contact'
            className='font-medium underline-offset-4 hover:underline hover:text-brand'
          >
            Contact
          </Link>
        </p>
      </main>
    </div>
  );
}
