import React from "react";
import Icons from "./Icons";
import Link from "next/link";

const Socials = () => {
  return (
    <>
      <Link
        href='https://www.twitter.com/baq2coaching'
        target='_twitter'
        className='flex justify-center flex-col'
      >
        <Icons.RiTwitterXLine className='icons' />
      </Link>
      <Link
        href='https://www.linkedin.com/in/syedbaqirali'
        target='_linkedin'
        className='flex justify-center flex-col '
      >
        <Icons.FaLinkedinIn className='icons' />
      </Link>
      <Link
        href='https://linktr.ee/syedbaqirali'
        target='_linktree'
        className='flex justify-center flex-col '
      >
        <Icons.PiLinktreeLogoLight className='icons' />
      </Link>
      <Link
        href='https://calendly.com/syedbaqirali/30min'
        target='_calendly'
        className='flex justify-center flex-col'
      >
        <Icons.CalendarClock className='icons' />
      </Link>
    </>
  );
};

export default Socials;
