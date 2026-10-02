"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * When the browser restores a page from bfcache (Back), or after an editor
 * save event, refresh RSC data so title/body are not stale.
 */
export default function RefreshOnBack() {
  const router = useRouter();

  useEffect(() => {
    const refresh = () => router.refresh();
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) refresh();
    };
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("popstate", refresh);
    window.addEventListener("sba:essays-updated", refresh);
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("popstate", refresh);
      window.removeEventListener("sba:essays-updated", refresh);
    };
  }, [router]);

  return null;
}
