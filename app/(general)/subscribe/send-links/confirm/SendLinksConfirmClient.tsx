"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { newsletter_send_links_confirm_url } from "@/utils/endpoints/endpoints";
import { readJson } from "@/lib/http";

function ConfirmInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Confirming…");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage("Missing confirmation token.");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `${newsletter_send_links_confirm_url}?token=${encodeURIComponent(token)}`,
          { method: "GET", headers: { Accept: "application/json" } }
        );
        const data = await readJson<{
          status?: string;
          message?: string;
        }>(res, {});
        if (cancelled) return;
        setOk(res.ok && data.status === "ok");
        setMessage(
          data.message ||
            (res.ok
              ? "If the link was valid, the essay links are on the way."
              : "This confirmation link is invalid or expired.")
        );
      } catch {
        if (!cancelled) {
          setMessage("Could not confirm right now. Try again later.");
        }
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
            {ok ? "Links on the way" : "Confirm essay links"}
          </h1>
          <p className='max-w-xl text-lg leading-relaxed text-foreground/80'>
            {message}
          </p>
          <p className='pt-2'>
            <Link
              href='/writing'
              className='text-brand font-medium underline-offset-4 hover:underline'
            >
              Browse writing
            </Link>
          </p>
        </header>
      </div>
    </div>
  );
}

export default function SendLinksConfirmClient() {
  return (
    <Suspense fallback={<p className='p-8 text-muted-foreground'>Loading…</p>}>
      <ConfirmInner />
    </Suspense>
  );
}
