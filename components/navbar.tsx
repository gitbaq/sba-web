"use client";
import * as React from "react";
// import Search from "./search";
import NavLinks from "./navlinks";
import Usernav from "./user/Usernav";
import Icons from "./Icons";
import Brand from "./brand";
import { useSidebar } from "./ui/sidebar";

export default function Navbar() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className='flex flex-col w-full shadow-sm min-h-16 justify-center border-b bg-slate-900 text-slate-200'>
      <div className='flex flex-row items-center justify-end'>
        <div className='flex flex-row w-2/5 gap-1 px-2 items-center'>
          <Icons.Menu
            onClick={toggleSidebar}
            className='hover:cursor-pointer'
          />

          <Brand />
        </div>
        <div className='w-full lg:max-w-4xl md:max-w-xl'>
          {/* <Search /> */}&nbsp;
        </div>
        <div className='flex flex-row lg:w-2/5 w-full gap-3 items-center justify-end px-3'>
          <NavLinks />
          <Usernav />
        </div>
      </div>
    </div>
  );
}
