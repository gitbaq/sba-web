"use client";

import { LinkedinShareButton } from "react-share";
import Icons from "@/components/Icons";
import CopyLinkButton from "@/components/CopyLinkButton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Props = {
  url: string;
  title: string;
  summary?: string;
};

export default function EssayShareActions({ url, title, summary }: Props) {
  return (
    <div
      className='flex flex-wrap items-center gap-1'
      role='group'
      aria-label='Share this essay'
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <span className='inline-flex'>
            <LinkedinShareButton
              title={title}
              summary={summary || title}
              url={url}
              className='inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              aria-label='Share on LinkedIn'
            >
              <Icons.FaLinkedin className='h-4 w-4' aria-hidden />
              LinkedIn
            </LinkedinShareButton>
          </span>
        </TooltipTrigger>
        <TooltipContent side='bottom'>Share on LinkedIn</TooltipContent>
      </Tooltip>
      <CopyLinkButton url={url} />
    </div>
  );
}
