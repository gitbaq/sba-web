"use client";
import * as React from "react";
// import Search from "./search";
import NavLinks from "./navlinks";
import Usernav from "./user/Usernav";

import NavbarBrand from "./navbarbrand";
import dynamic from "next/dynamic";
import NavbarTrigger from "./NavbarTrigger";

export default function Navbar() {
  const ThemeSelectorNoSSR = dynamic(() => import("./ThemeSelector"), {
    ssr: false,
  });
  return (
    <div className='flex flex-row w-full border-b border-accent min-h-16 justify-center'>
      <div className='flex justify-start px-4 w-1/4'>
        <NavbarTrigger />
      </div>
      <div className='w-1/2'>
        <NavbarBrand />
      </div>
      <div className='flex flex-row gap-3 items-center justify-end px-3 w-1/4'>
        <NavLinks />
        <ThemeSelectorNoSSR />
        <Usernav />
      </div>
    </div>
  );
}
