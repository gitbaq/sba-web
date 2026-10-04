import { CTA } from "@/lib/ctas";
import { SUBSCRIBE } from "@/lib/copy";
import SubscribeForm from "@/components/SubscribeForm";
import SendLinksToMe from "@/components/SendLinksToMe";

/** End-of-essay subscribe block. Series navigation lives in SeriesNav below. */
export default function ArticleEndCta({ essayId }: { essayId?: number }) {
  return (
    <aside className='flex flex-col gap-8 border-t border-border pt-10 max-w-xl'>
      <div className='flex flex-col gap-3'>
        <p className='accent-label'>{SUBSCRIBE.eyebrow}</p>
        <h2 className='display-title text-2xl md:text-3xl'>
          {SUBSCRIBE.heading}
        </h2>
        <p className='leading-relaxed text-muted-foreground'>{SUBSCRIBE.blurb}</p>
        <SubscribeForm variant='end' submitLabel={CTA.subscribe} />
        <p className='text-sm text-muted-foreground'>
          Prefer feeds?{" "}
          <a
            href='/feed.xml'
            className='font-semibold text-brand underline-offset-4 hover:underline'
          >
            {CTA.rss}
          </a>
        </p>
      </div>

      {essayId ? (
        <div
          id='email-to-me'
          className='rounded-xl border border-border bg-secondary/30 p-5'
        >
          <SendLinksToMe essayIds={[essayId]} />
        </div>
      ) : null}
    </aside>
  );
}
