import Link from "next/link";
import React from "react";
import Icons from "./Icons";

const Footer_links = () => {
  return (
    <>
      {/* <Link href='about'>About</Link>
      <Link href='blog'>Blog</Link> */}
      <Link href='learning' className='icons_diff text-2xl text-pink-800'>
        <Icons.GiBookshelf />
      </Link>
    </>
  );
};

export default Footer_links;
