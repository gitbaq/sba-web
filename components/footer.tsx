import React from "react";
import Socials from "./socials";
import Brand from "./brand";
// import Footer_links from "./footer_links";

const Footer = () => {
  return (
    <footer className='flex md:flex-row border-t border-slate-100 min-h-24 h-24 flex-col w-full justify-center md:justify-normal items-center md:gap-5 gap-2 py-5 px-3'>
      <div className='flex flex-row md:w-1/3 w-full  heading md:justify-start justify-center'>
        <Brand />
      </div>
      <div className='flex flex-row md:w-1/3 gap-3 justify-center'>
        <Socials />
      </div>
      <div className='flex flex-row md:w-1/3 w-full text-slate-400 text-xs  md:justify-end justify-center font-thin px-2'>
        <span className='md:hidden flex'>
          &copy;{new Date().getFullYear()} www.syedbaqirali.com
        </span>
        <span className='md:flex hidden'>
          <Brand />
        </span>
      </div>
    </footer>
  );
};

export default Footer;
