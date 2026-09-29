"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/** Fires GA4 read-depth milestones once per article mount. */
export default function ArticleReadDepth({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  useEffect(() => {
    const fired = new Set<number>();
    const marks = [25, 50, 75, 100];

    function onScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      for (const mark of marks) {
        if (pct >= mark && !fired.has(mark)) {
          fired.add(mark);
          trackEvent("article_read_depth", {
            percent: mark,
            article_slug: slug,
            article_title: title,
          });
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug, title]);

  return null;
}
