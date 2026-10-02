"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { newsletter_unsubscribe_url } from "@/utils/endpoints/endpoints";

function UnsubscribeInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Unsubscribing…");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage("Missing unsubscribe token.");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `${newsletter_unsubscribe_url}?token=${encodeURIComponent(token)}`,
          { method: "GET", headers: { Accept: "application/json" } }
        );
        const data = (await res.json().catch(() => ({}))) as {
          message?: string;
        };
        if (cancelled) return;
        setDone(res.ok);
        setMessage(data.message || (res.ok ? "You are unsubscribed." : "Could not unsubscribe."));
      } catch {
        if (!cancelled) setMessage("Could not unsubscribe right now.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className='w-full'>
      <div className='life-hero'>
        <header className='relative z-[2] mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 pt-6 pb-12 md:pt-8 md:pb-16'>
          <p className='accent-label'>Newsletter</p>
          <h1 className='display-title text-4xl text-foreground md:text-5xl'>
            {done ? "Unsubscribed" : "Unsubscribe"}
          </h1>
          <p className='max-w-xl text-lg leading-relaxed text-foreground/80'>
            {message}
          </p>
          <p className='pt-2'>
            <Link
              href='/subscribe'
              className='text-brand font-medium underline-offset-4 hover:underline'
            >
              Subscribe again
            </Link>
          </p>
        </header>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<p className='p-8 text-muted-foreground'>Loading…</p>}>
      <UnsubscribeInner />
    </Suspense>
  );
}
