import React from "react";
import Socials from "./socials";
import Brand from "./brand";
import Footer_links from "./footer_links";

const Footer = () => {
  return (
    <footer className='flex md:flex-row flex-col md:min-h-80 min-h-40 w-full items-center bg-diff gap-5 py-5 shadow-inner m-5'>
      <Brand />
      <Footer_links />
      <Socials />
    </footer>
  );
};

export default Footer;
