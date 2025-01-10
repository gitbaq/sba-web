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
import Icons from "../Icons";
import { web_url } from "@/utils/endpoints/endpoints";

export default function SharePanel({ subtopic }: { subtopic: SubTopic }) {
  return (
    <div className='flex flex-row items-center border rounded p-1 px-2 gap-1'>
      <Icons.Share2 className='mr-3 text-sky-800 icons icons-size' />
      <LinkedinShareButton
        title={subtopic.heading}
        summary={subtopic.subHeading}
        url={web_url}
        source={web_url}
      >
        <LinkedinIcon className='icons-size rounded hover:animate-pulse' />
      </LinkedinShareButton>
      <TwitterShareButton
        title={subtopic.heading}
        url={web_url}
        hashtags={["ai", "code", "syedbaqirali"]}
      >
        <TwitterIcon className='icons-size rounded hover:animate-pulse' />
      </TwitterShareButton>
      <WhatsappShareButton
        title={subtopic.heading}
        url={web_url}
        separator='***'
      >
        <WhatsappIcon className='icons-size rounded hover:animate-pulse' />
      </WhatsappShareButton>
    </div>
  );
}
