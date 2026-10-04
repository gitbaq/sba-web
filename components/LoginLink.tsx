import Link from "next/link";

/**
 * Footer Login link. Keep href static (no callbackUrl) for CDN/HTML cacheability.
 * Login page defaults to /admin; proxy still sets callbackUrl for guarded routes.
 */
export default function LoginLink({
  className,
  children = "Login",
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
