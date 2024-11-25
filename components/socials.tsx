import React from "react";
import Icons from "./Icons";
import Link from "next/link";

const Socials = () => {
  return (
    <div className='flex flex-row w-1/4 gap-3 px-2 align-middle'>
      <Link
        href='https://www.twitter.com/baq2coaching'
        target='_twitter'
        className='flex justify-center flex-col'
      >
        <Icons.RiTwitterXLine className='text-white icons' />
      </Link>
      <Link
        href='https://www.linkedin.com/in/syedbaqirali'
        target='_linkedin'
        className='flex justify-center flex-col '
      >
        <Icons.FaLinkedinIn className='text-white icons' />
      </Link>
    </div>
  );
};

export default Socials;
