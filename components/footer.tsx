import React from "react";
import Socials from "./socials";
import Brand from "./brand";
import Copyright from "./Copyright";
// import Copyright from "./Copyright";
// import Footer_links from "./footer_links";

const Footer = () => {
  return (
    <footer className='flex md:flex-row min-h-fit md:h-24 h-48 flex-col w-full justify-center md:justify-normal items-center md:gap-5 gap-3 p-3 bg-gradient-to-b from-stone-100 via-stone-50 to-stone-200 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-800 z-50'>
      <div className='flex flex-row md:w-1/3 w-full md:justify-start justify-center'>
        <Brand />
      </div>
      <div className='flex flex-row md:w-1/3 gap-3 justify-center'>
        <Socials />
      </div>

      <div className='flex flex-row md:w-1/3 w-full md:justify-end justify-center'>
        <Copyright />
      </div>
    </footer>
  );
};

export default Footer;
