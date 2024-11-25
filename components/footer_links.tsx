import Link from "next/link";
import React from "react";

const Footer_links = () => {
  return (
    <div className='md:w-2/4 w-full ml-5 gap-3 flex flex-col md:items-start items-center justify-center'>
      <Link href='about'>About</Link>
      <Link href='blog'>Blog</Link>
      <Link href='contact'>Contact</Link>
    </div>
  );
};

export default Footer_links;
