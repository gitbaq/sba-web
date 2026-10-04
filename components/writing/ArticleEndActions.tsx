"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CTA } from "@/lib/ctas";
import { SUBSCRIBE } from "@/lib/copy";
import SubscribeForm from "@/components/SubscribeForm";
import SendLinksToMe from "@/components/SendLinksToMe";
import {
  isNewsletterSubscribed,
  markNewsletterSubscribed,
} from "@/lib/newsletterPreference";

/** Essay-end subscribe + optional self-send, without two competing forms. */
export default function ArticleEndActions({ essayId }: { essayId?: number }) {
  const pathname = usePathname();
  const [subscribed, setSubscribed] = useState(false);
  const [showSend, setShowSend] = useState(false);

  useEffect(() => {
    setSubscribed(isNewsletterSubscribed());
  }, []);

  function onSubscribed() {
    markNewsletterSubscribed();
    setSubscribed(true);
  }

  const callback = encodeURIComponent(pathname || "/writing");
  const loginHref = `/login?callbackUrl=${callback}`;
  const signupHref = `/signup?callbackUrl=${callback}`;

  return (
    <aside className='flex flex-col gap-5 border-t border-border pt-10 max-w-xl'>
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
      ) : null}

      {essayId ? (
        <div className='flex flex-col gap-3'>
          <p className='text-sm leading-relaxed text-muted-foreground'>
            <Link
              href={loginHref}
              className='font-semibold text-brand underline-offset-4 hover:underline'
            >
              Log in
            </Link>
            {" or "}
            <Link
              href={signupHref}
              className='font-semibold text-brand underline-offset-4 hover:underline'
            >
              sign up
            </Link>{" "}
            to comment
            {subscribed ? (
              <>
                , or{" "}
                <button
                  type='button'
                  onClick={() => setShowSend((v) => !v)}
                  className='font-semibold text-brand underline-offset-4 hover:underline'
                  aria-expanded={showSend}
                >
                  email this essay to yourself
                </button>
                .
              </>
            ) : (
              <>
                . Already subscribed?{" "}
                <button
                  type='button'
                  onClick={() => setShowSend((v) => !v)}
                  className='font-semibold text-brand underline-offset-4 hover:underline'
                  aria-expanded={showSend}
                >
                  Email this essay to yourself
                </button>
                .
              </>
            )}
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
