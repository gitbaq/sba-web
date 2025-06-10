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
        <Icons.FaXTwitter className='icons' />
      </Link>
      {/* <Link
        href='https://www.linkedin.com/in/syedbaqirali'
        target='_linkedin'
        className='flex justify-center flex-col '
      >
        <Icons.FaLinkedin className='icons' />
      </Link> */}

      <a
        className='libutton'
        href='https://www.linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=syedbaqirali'
        target='_blank'
      >
        Follow on LinkedIn
      </a>
      <Link
        href='https://linktr.ee/syedbaqirali'
        target='_linktree'
        className='flex justify-center flex-col '
      >
        <Icons.PiLinktreeLogo className='icons' />
      </Link>
      <Link
        href='https://calendly.com/syedbaqirali/30min'
        target='_calendly'
        className='flex justify-center flex-col'
      >
        <Icons.FaCalendarDays className='icons' />
      </Link>
    </>
  );
};

export default Socials;
