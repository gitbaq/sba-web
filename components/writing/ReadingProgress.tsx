"use client";

import { useEffect, useState } from "react";

/** Subtle reading progress - respects reduced motion via CSS transitions only. */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const height = el.scrollHeight - el.clientHeight;
      setProgress(height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className='fixed top-16 left-0 right-0 z-40 h-0.5 bg-transparent pointer-events-none'
      role='progressbar'
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label='Reading progress'
    >
      <div
        className='h-full bg-brand transition-[width] duration-150 ease-out motion-reduce:transition-none'
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
