import React from "react";
import Socials from "./socials";
import Brand from "./brand";
import Footer_links from "./footer_links";

const Footer = () => {
  return (
    <footer className='flex md:flex-row flex-col md:min-h-80 min-h-40 min-w-full max-w-screen items-center bg-diff gap-5 py-5 shadow-inner m-5 justify-between text-stone-200'>
      <div className='flex flex-row w-1/3 px-5 heading'>
        <Brand />
      </div>
      <div className='flex flex-row w-1/3 gap-3 justify-center'>
        <Socials />
      </div>
      <div className='flex flex-row w-1/3 justify-center px-5 sub-heading'>
        <Footer_links />
      </div>
    </footer>
  );
};

export default Footer;
