"use client";

import { useEffect, useState } from "react";

type Props = {
  user: string;
  domain: string;
  className?: string;
};

/** Renders an email without a plain mailto in the initial HTML. */
export default function ObfuscatedEmail({ user, domain, className }: Props) {
  const [href, setHref] = useState<string>("");
  const label = `${user}\u0040${domain}`;

  useEffect(() => {
    setHref(`mailto:${user}@${domain}`);
  }, [user, domain]);

  if (!href) {
    return <span className={className}>{label}</span>;
  }

  return (
    <a href={href} className={className}>
      {label}
    </a>
  );
}
