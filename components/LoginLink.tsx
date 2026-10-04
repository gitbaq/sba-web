import Link from "next/link";

/**
 * Footer admin entry. Keep href static (no callbackUrl) for CDN/HTML cacheability.
 * Readers sign in from essay comment CTAs (/login?callbackUrl=…), not here.
 */
export default function LoginLink({
  className,
  children = "Admin login",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Link href='/login' className={className} prefetch={false}>
      {children}
    </Link>
  );
}
