"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Footer Login link. SSR always renders `/login` so public pages stay cacheable.
 * After mount, attach callbackUrl from window.location (no useSearchParams).
 */
export default function LoginLink({
  className,
  children = "Login",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const [href, setHref] = useState("/login");

  useEffect(() => {
    const path = `${window.location.pathname}${window.location.search}`;
    if (!path || path.startsWith("/login") || path.startsWith("/logout")) {
      setHref("/login");
      return;
    }
    setHref(`/login?callbackUrl=${encodeURIComponent(path)}`);
  }, []);

  return (
    <Link href={href} className={className} prefetch={false}>
      {children}
    </Link>
  );
}
