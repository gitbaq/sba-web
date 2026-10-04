"use client";

import {
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import Icons from "@/components/Icons";
import CopyLinkButton from "@/components/CopyLinkButton";

type Props = {
  url: string;
  title: string;
  summary?: string;
  /** compact: bare row. panel: labeled one-line share bar. */
  variant?: "compact" | "panel";
};

const btn =
  "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium text-foreground transition-colors hover:bg-brand/5 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function EssayShareActions({
  url,
  title,
  summary,
  variant = "compact",
}: Props) {
  const actions = (
    <div
      className='flex flex-nowrap items-center gap-1 overflow-x-auto sm:gap-2'
      role='group'
      aria-label='Share this essay'
    >
      <LinkedinShareButton
        title={title}
        summary={summary || title}
        url={url}
        className={btn}
        aria-label='Share on LinkedIn'
      >
        <Icons.FaLinkedin className='h-4 w-4' aria-hidden />
        LinkedIn
      </LinkedinShareButton>
      <span className='h-5 w-px shrink-0 bg-border' aria-hidden />
      <TwitterShareButton
        title={title}
        url={url}
        className={btn}
        aria-label='Share on X'
      >
        <Icons.FaXTwitter className='h-4 w-4' aria-hidden />
        X
      </TwitterShareButton>
      <span className='h-5 w-px shrink-0 bg-border' aria-hidden />
      <WhatsappShareButton
        title={title}
        url={url}
        separator=' · '
        className={btn}
        aria-label='Share on WhatsApp'
      >
        <Icons.FaWhatsapp className='h-4 w-4' aria-hidden />
        WhatsApp
      </WhatsappShareButton>
      <span className='h-5 w-px shrink-0 bg-border' aria-hidden />
      <CopyLinkButton url={url} className={btn} />
    </div>
  );

  if (variant === "compact") {
    return actions;
  }

  return (
    <aside
      aria-labelledby='share-essay'
      className='flex flex-col gap-3 rounded-lg border border-brand/25 bg-brand-muted/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5'
    >
      <h2
        id='share-essay'
        className='shrink-0 text-sm font-semibold text-foreground'
      >
        Share
      </h2>
      {actions}
    </aside>
  );
}
