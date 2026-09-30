"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AUDIENCES, AudienceId } from "@/lib/audience";
import Reveal from "@/components/Reveal";
import { trackEvent } from "@/lib/analytics";

type Props = {
  onSelect: (id: AudienceId) => void;
};

export default function AudiencePicker({ onSelect }: Props) {
  const router = useRouter();

  function choose(id: AudienceId, href: string) {
    trackEvent("audience_select", { audience_id: id, audience_href: href });
    onSelect(id);
    router.push(href);
  }

  return (
    <section
      aria-labelledby='audience-heading'
      className='life-hero relative w-full min-h-[70vh]'
    >
      <div className='relative z-[2] mx-auto flex w-full max-w-2xl flex-col px-4 pt-6 pb-16 md:pt-8 md:pb-20'>
        <Reveal as='header' immediate className='mb-10 flex flex-col gap-4'>
          <p className='accent-label'>Welcome</p>
          <h1
            id='audience-heading'
            className='display-title text-4xl md:text-5xl text-foreground'
          >
            What are you looking for?
          </h1>
          <p className='text-muted-foreground max-w-md text-base md:text-lg leading-relaxed'>
            Pick a path that matches your visit. You can change it anytime.
          </p>
        </Reveal>

        <Reveal delay={1} immediate>
          <ul className='flex flex-col list-none gap-3 p-0 m-0'>
            {AUDIENCES.map((a) => (
              <li key={a.id}>
                <button
                  type='button'
                  onClick={() => choose(a.id, a.href)}
                  className='group flex w-full flex-col gap-1 rounded-2xl border border-border/80 bg-card/90 px-5 py-5 text-left shadow-elev1 backdrop-blur-sm transition-all hover:border-brand/40 hover:-translate-y-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6'
                >
                  <span className='font-display text-lg md:text-xl font-semibold text-foreground tracking-tight group-hover:text-brand transition-colors'>
                    {a.label}
                  </span>
                  <span className='text-sm text-muted-foreground sm:text-right sm:max-w-xs leading-relaxed'>
                    {a.description}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={2} className='mt-10'>
          <p className='text-sm text-muted-foreground'>
            Prefer to browse?{" "}
            <Link
              href='/writing'
              className='text-brand font-medium underline-offset-4 hover:underline'
            >
              Go to Writing
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
