"use client"
import React from 'react'
import { SidebarProvider } from './ui/sidebar';
import Footer from './footer';
import Rightbar from './rightbar';
import { LearningSidebar } from './sidebar';
import Navbar from './navbar';
import { useIsMobile } from '@/hooks/use-mobile';

export default function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
    const isMobile = useIsMobile();
  return (
    <SidebarProvider defaultOpen={!isMobile} className='h-full w-full'>
      <div className='flex flex-col w-full h-full min-h-full'>
        <Navbar />
        <div className='flex flex-row w-full min-h-full h-full'>
          <LearningSidebar />
          <main className='flex flex-row w-full h-full items-start justify-center'>
            <div className=' w-full h-full'>{children}</div>
          </main>
          <div className='md:flex hidden flex-col min-h-full w-64 min-w-64'>
            <Rightbar />
          </div>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}

