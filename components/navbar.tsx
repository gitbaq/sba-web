"use client";
import * as React from "react";
import Search from "./search";
import NavLinks from "./navlinks";
import Usernav from "./user/Usernav";
import Icons from "./Icons";
import Brand from "./brand";
import { useSidebar } from "./ui/sidebar";

export default function Navbar() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className='flex flex-col w-full shadow-sm min-h-24 justify-center border-b bg-slate-800 text-slate-200'>
      <div className='flex flex-row items-center justify-end'>
        <div className='flex flex-row w-2/5 gap-1 px-2 items-center'>
          <Icons.Menu
            onClick={toggleSidebar}
            className='hover:cursor-pointer'
          />

          <Brand />
        </div>
        <Search />
        <div className='flex flex-row w-2/5 gap-3 items-center justify-end px-2'>
          <NavLinks />
          <Usernav />
        </div>
      </div>
    </div>
  );
}
