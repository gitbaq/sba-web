"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginLinkInner({
  className,
  children = "Login",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const current =
    pathname && pathname !== "/login"
      ? `${pathname}${search ? `?${search}` : ""}`
      : "";
  const href = current
    ? `/login?callbackUrl=${encodeURIComponent(current)}`
    : "/login";

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/** Login link that returns the user to the page they came from. */
export default function LoginLink({
  className,
  children = "Login",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <Link href='/login' className={className}>
          {children}
        </Link>
      }
    >
      <LoginLinkInner className={className}>{children}</LoginLinkInner>
    </Suspense>
  );
}
