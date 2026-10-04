"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CTA } from "@/lib/ctas";

const STORAGE_KEY = "sba-dismiss-subscribe-bar";

export default function StickySubscribeBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setDismissed(false);
    }

    const onScroll = () => {
      const el = document.documentElement;
      const height = el.scrollHeight - el.clientHeight;
      const ratio = height > 0 ? el.scrollTop / height : 0;
      setVisible(ratio > 0.35);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function dismiss() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setDismissed(true);
  }

  if (dismissed || !visible) return null;

  return (
    <div
      role='region'
      aria-label='Subscribe to newsletter prompt'
      className='fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-sm p-3 md:p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]'
    >
      <div className='mx-auto max-w-3xl flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4'>
        <p className='text-sm text-muted-foreground flex-1'>
          Enjoying this? Get the next essay by email. About once a week.
        </p>
        <div className='flex items-center gap-2 shrink-0'>
          <Link href='/subscribe' className='craft-cta-primary'>
            {CTA.subscribe}
          </Link>
          <button
            type='button'
            onClick={dismiss}
            className='craft-cta-ghost'
            aria-label='Dismiss subscribe prompt'
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
