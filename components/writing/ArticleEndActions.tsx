"use client";

import { useEffect, useState } from "react";
import { CTA } from "@/lib/ctas";
import { SUBSCRIBE } from "@/lib/copy";
import SubscribeForm from "@/components/SubscribeForm";
import SendLinksToMe from "@/components/SendLinksToMe";
import {
  isNewsletterSubscribed,
  markNewsletterSubscribed,
} from "@/lib/newsletterPreference";

/**
 * Essay-end newsletter block only.
 * Comment login/signup lives in EssayComments so the two jobs stay separate.
 */
export default function ArticleEndActions({ essayId }: { essayId?: number }) {
  const [subscribed, setSubscribed] = useState(false);
  const [showSend, setShowSend] = useState(false);

  useEffect(() => {
    setSubscribed(isNewsletterSubscribed());
  }, []);

  function onSubscribed() {
    markNewsletterSubscribed();
    setSubscribed(true);
  }

  return (
    <aside className='flex flex-col gap-4 border-t border-border pt-10 max-w-xl'>
      {!subscribed ? (
        <div className='flex flex-col gap-3'>
          <p className='accent-label'>{SUBSCRIBE.eyebrow}</p>
          <h2 className='display-title text-2xl md:text-3xl'>
            {SUBSCRIBE.heading}
          </h2>
          <p className='leading-relaxed text-muted-foreground'>
            {SUBSCRIBE.blurb}
          </p>
          <SubscribeForm
            variant='end'
            submitLabel={CTA.subscribe}
            onSubscribed={onSubscribed}
          />
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
      ) : (
        <div className='flex flex-col gap-1'>
          <p className='accent-label'>{SUBSCRIBE.eyebrow}</p>
          <p className='text-sm text-muted-foreground'>
            You are on the list for new essays.
          </p>
        </div>
      )}

      {essayId ? (
        <div className='flex flex-col gap-3'>
          <p className='text-sm text-muted-foreground'>
            {subscribed ? "Want a copy in your inbox? " : "Already subscribed? "}
            <button
              type='button'
              onClick={() => setShowSend((v) => !v)}
              className='font-semibold text-brand underline-offset-4 hover:underline'
              aria-expanded={showSend}
            >
              Email this essay to yourself
            </button>
            .
          </p>

          {showSend ? (
            <div
              id='email-to-me'
              className='rounded-xl border border-border bg-secondary/30 p-5'
            >
              <SendLinksToMe essayIds={[essayId]} compact />
            </div>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
