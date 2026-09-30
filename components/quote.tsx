import type { RandomQuote } from "@/types/types";

/** Soft aside: no heading, no CTA. Rendered from server-fetched data. */
export default function Quote({ quote }: { quote: RandomQuote | null }) {
  if (!quote?.quoteText) return null;

  return (
    <aside
      aria-label='A short quote'
      className='mx-auto max-w-lg border-y border-border/70 py-8 text-center'
    >
      <blockquote className='m-0'>
        <p className='font-article text-base md:text-lg leading-relaxed text-foreground/80 italic'>
          “{quote.quoteText}”
        </p>
        {quote.author ? (
          <footer className='mt-3 text-xs tracking-wide text-muted-foreground not-italic'>
            {quote.author}
          </footer>
        ) : null}
      </blockquote>
    </aside>
  );
}
