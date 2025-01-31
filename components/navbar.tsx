"use client";
import * as React from "react";
// import Search from "./search";
import NavLinks from "./navlinks";
import Usernav from "./user/Usernav";

import NavbarBrand from "./navbarbrand";

export default function Navbar() {
  return (
    <div className='flex flex-row w-full border-b border-accent min-h-16 justify-center'>
      <div className='self-center w-full px-4'>
        <NavbarBrand />
      </div>

      <div className='flex flex-row lg:w-3/5 w-full gap-3 items-center justify-end px-3'>
        <NavLinks />

        <Usernav />
      </div>
    </div>
  );
}
