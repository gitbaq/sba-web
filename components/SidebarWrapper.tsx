"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "./ui/sidebar";
import { LearningSidebar } from "./sidebar";
import Navbar from "./navbar";
import { useIsMobile } from "@/hooks/use-mobile";

function pathUsesSidebar(pathname: string) {
  return (
    pathname.startsWith("/editor") || pathname.startsWith("/admin")
  );
}

export default function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const showSidebar = pathUsesSidebar(pathname);

  if (!showSidebar) {
    return (
      <div className='flex flex-col w-full h-full min-h-full'>
        <Navbar />
        <main
          id='main-content'
          tabIndex={-1}
          className='w-full flex-1 pt-16 outline-none'
        >
          {children}
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider
      defaultOpen={!isMobile}
      className='h-full w-full'
      title='Sidebar'
    >
      <div className='flex flex-col w-full h-full min-h-full'>
        <Navbar />
        <div className='flex flex-row w-full min-h-full h-full'>
          <LearningSidebar />
          <main
            id='main-content'
            tabIndex={-1}
            className='w-full flex-1 pt-16 outline-none'
          >
            <div className='w-full h-full'>{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
