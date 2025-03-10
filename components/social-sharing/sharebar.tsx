"use client";

import { SubTopic } from "@/types/types";
import React from "react";
import {
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { web_url } from "@/utils/endpoints/endpoints";

export default function SharePanel({ subtopic }: { subtopic: SubTopic }) {
  return (
    <div className='flex flex-row items-center rounded gap-1'>
      <div className='flex flex-row items-center justify-center gap-1'>
        <LinkedinShareButton
          title={subtopic.heading}
          summary={subtopic.subHeading}
          url={web_url}
          source={web_url}
        >
          <LinkedinIcon className='w-5 h-5 rounded-sm' />
        </LinkedinShareButton>
        <TwitterShareButton
          title={subtopic.heading}
          url={web_url}
          hashtags={["ai", "code", "syedbaqirali"]}
        >
          <TwitterIcon className='w-5 h-5 rounded-sm ' />
        </TwitterShareButton>
        <WhatsappShareButton
          title={subtopic.heading}
          url={web_url}
          separator='***'
        >
          <WhatsappIcon className='w-5 h-5 rounded-sm ' />
        </WhatsappShareButton>
      </div>
    </div>
  );
}
