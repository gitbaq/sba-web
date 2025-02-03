import React from "react";
import Socials from "./socials";
import Brand from "./brand";
import Copyright from "./Copyright";
// import Copyright from "./Copyright";
// import Footer_links from "./footer_links";

const Footer = () => {
  return (
    <footer className='flex md:flex-row flex-col min-h-24 h-fit w-full justify-center md:justify-normal items-center md:gap-5 gap-2 p-3 space-3 border-t border-accent'>
      <div className='flex flex-row md:w-1/3 w-full md:justify-start justify-center font-thin px-2'>
        <Brand />
      </div>
      <div className='flex flex-row md:w-1/3 gap-3 justify-center text-lg'>
        <Socials />
      </div>

      <div className='flex flex-row md:w-1/3 w-full md:justify-end justify-center'>
        <Copyright />
      </div>
    </footer>
  );
};

export default Footer;
