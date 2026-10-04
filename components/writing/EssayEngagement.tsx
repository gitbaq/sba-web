"use client";

import { useEffect, useState, useTransition } from "react";
import Icons from "@/components/Icons";
import {
  clapEssay,
  fetchEssayStats,
  recordEssayView,
  type EssayStats,
} from "@/lib/essayEngagement";

type Props = {
  essayId: number;
};

function formatCount(n: number): string {
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}k`;
}

/** Records a view on mount and offers a one-tap clap. */
export default function EssayEngagement({ essayId }: Props) {
  const [stats, setStats] = useState<EssayStats | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const viewed = await recordEssayView(essayId);
      if (!cancelled && viewed) {
        setStats(viewed);
        return;
      }
      const current = await fetchEssayStats(essayId);
      if (!cancelled && current) setStats(current);
    })();
    return () => {
      cancelled = true;
    };
  }, [essayId]);

  function onClap() {
    if (!stats || stats.clapped || pending) return;
    startTransition(async () => {
      const next = await clapEssay(essayId);
      if (next) setStats(next);
    });
  }

  const views = stats?.viewCount ?? 0;
  const claps = stats?.clapCount ?? 0;
  const clapped = Boolean(stats?.clapped);

  return (
    <div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
      <span className='inline-flex items-center gap-1.5 tabular-nums' title='Views'>
        <Icons.BookOpen className='h-4 w-4' aria-hidden />
        <span>
          {formatCount(views)} {views === 1 ? "view" : "views"}
        </span>
      </span>
      <button
        type='button'
        onClick={onClap}
        disabled={clapped || pending || !stats}
        className={[
          "inline-flex min-h-11 items-center gap-1.5 rounded-md border px-3 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          clapped
            ? "border-brand/40 bg-brand/10 text-brand"
            : "border-border/80 bg-background text-foreground hover:border-brand/40 hover:bg-brand/5 hover:text-brand",
          "disabled:cursor-default disabled:opacity-70",
        ].join(" ")}
        aria-pressed={clapped}
        aria-label={clapped ? "Already clapped" : "Clap for this essay"}
      >
        <Icons.Heart className='h-4 w-4' aria-hidden />
        <span className='tabular-nums'>
          {clapped ? "Clapped" : "Clap"}
          {claps > 0 ? ` · ${formatCount(claps)}` : ""}
        </span>
      </button>
    </div>
  );
}
