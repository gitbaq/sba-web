"use client";

import { SubTopic } from "@/types/types";
import {
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { web_url } from "@/utils/endpoints/endpoints";
import { articleHref } from "@/lib/articles";
import Icons from "@/components/Icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const shareBtn =
  "inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:text-brand hover:bg-accent/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function SharePanel({
  subtopic,
  shareUrl,
}: {
  subtopic: SubTopic;
  shareUrl?: string;
}) {
  const url = shareUrl || `${web_url}${articleHref(subtopic)}`;
  const title = subtopic.subHeading || subtopic.heading;

  return (
    <div
      className='flex flex-row items-center gap-1.5'
      role='group'
      aria-label='Share this essay'
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <span className='inline-flex'>
            <LinkedinShareButton
              title={title}
              summary={subtopic.subHeading}
              url={url}
              source={web_url}
              className={shareBtn}
              aria-label='Share on LinkedIn'
            >
              <Icons.FaLinkedin className='h-4 w-4' aria-hidden />
            </LinkedinShareButton>
          </span>
        </TooltipTrigger>
        <TooltipContent side='bottom'>LinkedIn</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <span className='inline-flex'>
            <TwitterShareButton
              title={title}
              url={url}
              hashtags={["ai", "writing", "syedbaqirali"]}
              className={shareBtn}
              aria-label='Share on X'
            >
              <Icons.FaXTwitter className='h-4 w-4' aria-hidden />
            </TwitterShareButton>
          </span>
        </TooltipTrigger>
        <TooltipContent side='bottom'>X</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <span className='inline-flex'>
            <WhatsappShareButton
              title={title}
              url={url}
              separator=' — '
              className={shareBtn}
              aria-label='Share on WhatsApp'
            >
              <Icons.FaWhatsapp className='h-4 w-4' aria-hidden />
            </WhatsappShareButton>
          </span>
        </TooltipTrigger>
        <TooltipContent side='bottom'>WhatsApp</TooltipContent>
      </Tooltip>
    </div>
  );
}
