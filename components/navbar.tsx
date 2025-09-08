"use client";
import * as React from "react";
import NavLinks from "./navlinks";
import Usernav from "./user/Usernav";

import NavbarBrand from "./navbarbrand";
import NavbarTrigger from "./NavbarTrigger";
import ThemeComponent from "./ThemeComponent";

export default function Navbar() {
  return (
    <div className='fixed top-0 left-0 right-0 z-50 bg-opacity-95 bg-secondary flex flex-row w-full border-b border-accent min-h-16 justify-center shadow-sm'>
      <div className='flex justify-start px-4 w-3/4 gap-2 items-center'>
        <NavbarTrigger />
        {/* </div>
      <div className='w-1/2'> */}
        <NavbarBrand />
      </div>
      <div className='flex flex-row gap-3 items-center justify-end px-3 w-1/4'>
        <NavLinks />
        <span className='md:flex hidden'>
          <ThemeComponent />
        </span>
        <Usernav />
      </div>
    </div>
  );
}
