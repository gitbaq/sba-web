"use client";

import { useState } from "react";
import Icons from "@/components/Icons";

type Props = {
  url: string;
  className?: string;
};

export default function CopyLinkButton({ url, className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type='button'
      onClick={onCopy}
      className={[
        "inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={copied ? "Link copied" : "Copy link"}
    >
      <Icons.Link className='h-4 w-4' aria-hidden />
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
