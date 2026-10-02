"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import NavLinks from "./navlinks";
import ThemeToggleComponent from "./ThemeToggleComponent";
import Usernav from "./user/Usernav";
import NavbarBrand from "./navbarbrand";
import NavbarTrigger from "./NavbarTrigger";
import ManageNav from "./ManageNav";

function pathUsesSidebar(pathname: string) {
  return pathname.startsWith("/editor") || pathname.startsWith("/admin");
}

export default function Navbar() {
  const pathname = usePathname();
  const showSidebarTrigger = pathUsesSidebar(pathname);
  const isAdminSurface =
    pathname.startsWith("/admin") || pathname.startsWith("/editor");

  return (
    <header className='site-header fixed top-0 left-0 right-0 z-50 flex flex-row w-full min-h-14 items-center border-b border-border/80 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/90'>
      <div className='flex justify-start px-4 flex-1 gap-2 items-center min-w-0'>
        {showSidebarTrigger && <NavbarTrigger />}
        <NavbarBrand />
        {isAdminSurface && (
          <span className='hidden sm:inline-flex items-center rounded-sm border border-spark/40 bg-spark/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-spark'>
            Admin
          </span>
        )}
      </div>
      <div className='flex flex-row gap-1 md:gap-2 items-center justify-end px-3 shrink-0 h-full'>
        <NavLinks />
        <ManageNav />
        <div className='hidden md:flex items-center pl-1 border-l border-border/60 ml-1'>
          <ThemeToggleComponent />
        </div>
        <Usernav />
      </div>
    </header>
  );
}
