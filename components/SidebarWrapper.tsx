"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "./ui/sidebar";
import { LearningSidebar } from "./sidebar";
import AdminSidebar from "./admin/AdminSidebar";
import Navbar from "./navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AdminSidebarModeProvider,
  useAdminSidebarMode,
} from "./admin/AdminSidebarMode";

function pathUsesSidebar(pathname: string) {
  return pathname.startsWith("/editor") || pathname.startsWith("/admin");
}

/** Keeps shadcn open state + mobile sheet in sync with Full / Icons / Hide. */
function AdminSidebarSync() {
  const { mode, setMode } = useAdminSidebarMode();
  const { setOpen, setOpenMobile, openMobile, isMobile } = useSidebar();
  const wasMobileOpen = React.useRef(false);

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(mode === "expanded");
      return;
    }
    // Controlled `open` already tracks expanded. Skip setOpen when hidden so
    // we don't fire onOpenChange(false) → which used to force Icons.
    if (mode === "hidden") return;
    setOpen(mode === "expanded");
  }, [mode, isMobile, setOpen, setOpenMobile]);

  // Sheet dismissed (backdrop / swipe) → Hide. Only after it was open,
  // so we don't fight the open transition when switching to Full.
  useEffect(() => {
    if (!isMobile) {
      wasMobileOpen.current = false;
      return;
    }
    if (wasMobileOpen.current && !openMobile && mode === "expanded") {
      setMode("hidden");
    }
    wasMobileOpen.current = openMobile;
  }, [openMobile, isMobile, mode, setMode]);

  return null;
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const { mode, setMode } = useAdminSidebarMode();
  const showRail = mode !== "hidden";

  return (
    <SidebarProvider
      open={mode === "expanded"}
      onOpenChange={(open) => {
        // Rail / shortcut: Full ↔ Icons. Do not override an explicit Hide —
        // AdminSidebarSync also calls setOpen(false) when mode is hidden/icon.
        if (open) {
          setMode("expanded");
          return;
        }
        if (mode === "hidden") return;
        setMode("icon");
      }}
      className='admin-console'
      style={
        {
          "--sidebar-width": "15rem",
          "--sidebar-width-icon": "2.5rem",
        } as React.CSSProperties
      }
    >
      <AdminSidebarSync />
      {showRail ? <AdminSidebar /> : null}
      <SidebarInset
        id='main-content'
        tabIndex={-1}
        className='admin-main min-h-svh outline-none'
      >
        <Navbar />
        <div className='w-full flex-1 pt-16'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
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
  const isAdminSurface =
    pathname.startsWith("/admin") || pathname.startsWith("/editor");

  if (!showSidebar) {
    return (
      <div className='flex min-h-full w-full flex-col'>
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

  if (isAdminSurface) {
    return (
      <AdminSidebarModeProvider>
        <AdminShell>{children}</AdminShell>
      </AdminSidebarModeProvider>
    );
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <LearningSidebar />
      <SidebarInset
        id='main-content'
        tabIndex={-1}
        className='min-h-svh outline-none'
      >
        <Navbar />
        <div className='w-full flex-1 pt-16'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
