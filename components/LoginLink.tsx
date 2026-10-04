import Link from "next/link";

/**
 * Footer Login link. Always lands on Admin home after login
 * (proxy still sets callbackUrl when guarding /admin or /editor).
 */
export default function LoginLink({
  className,
  children = "Login",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Link
      href='/login?callbackUrl=%2Fadmin'
      className={className}
      prefetch={false}
    >
      {children}
    </Link>
  );
}
