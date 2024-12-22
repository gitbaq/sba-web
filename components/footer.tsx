import React from "react";
import Socials from "./socials";
import Brand from "./brand";
// import Footer_links from "./footer_links";

const Footer = () => {
  return (
    <footer
      className='flex flex-col 
    md:min-h-40 min-h-40 
    min-w-full max-w-screen items-center bg-transparent 
    gap-5 py-5 shadow-2xl shadow-slate-800 justify-around'
    >
      <div className='flex md:flex-row flex-col w-full items-center gap-5'>
        <div className='flex flex-row md:w-1/3 w-full px-5 heading md:justify-start justify-center'>
          <Brand />
        </div>
        <div className='flex flex-row w-1/3 gap-3 justify-center'>
          <Socials />
        </div>
        {/* <div className='flex flex-row w-1/3 justify-center px-5 sub-heading'>
          <Footer_links />
        </div> */}
      </div>
      <div className='font-thin'>
        &copy; {new Date().getFullYear()} www.syedbaqirali.com
      </div>
    </footer>
  );
};

export default Footer;
