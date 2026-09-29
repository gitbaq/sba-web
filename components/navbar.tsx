"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import NavLinks from "./navlinks";
import Usernav from "./user/Usernav";
import NavbarBrand from "./navbarbrand";
import NavbarTrigger from "./NavbarTrigger";
import ThemeComponent from "./ThemeComponent";

function pathUsesSidebar(pathname: string) {
  return pathname.startsWith("/editor") || pathname.startsWith("/admin");
}

export default function Navbar() {
  const pathname = usePathname();
  const showSidebarTrigger = pathUsesSidebar(pathname);

  return (
    <header className='fixed top-0 left-0 right-0 z-50 flex flex-row w-full min-h-14 items-center border-b border-border/80 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65'>
      <div className='flex justify-start px-4 flex-1 gap-2 items-center min-w-0'>
        {showSidebarTrigger && <NavbarTrigger />}
        <NavbarBrand />
      </div>
      <div className='flex flex-row gap-1 md:gap-2 items-center justify-end px-3 shrink-0 h-full'>
        <NavLinks />
        <div className='hidden md:flex items-center pl-1 border-l border-border/60 ml-1'>
          <ThemeComponent />
        </div>
        <Usernav />
      </div>
    </header>
  );
}
