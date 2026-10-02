"use client";

import * as React from "react";
import { PanelLeft, PanelLeftClose, Columns2 } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useAdminSidebarModeOptional } from "@/components/admin/AdminSidebarMode";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/** Header control: Full / Icons / Hide (mobile: Full or Hide). */
export default function NavbarTrigger() {
  const adminMode = useAdminSidebarModeOptional();
  const { toggleSidebar, openMobile } = useSidebar();

  // Non-admin learning sidebar: simple toggle.
  if (!adminMode) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='h-9 w-9 shrink-0'
            aria-label='Toggle sidebar'
            onClick={toggleSidebar}
          >
            <PanelLeft className='h-4 w-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent side='bottom'>Toggle sidebar</TooltipContent>
      </Tooltip>
    );
  }

  const { mode, setMode, isMobile } = adminMode;

  if (isMobile) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='h-9 w-9 shrink-0'
            aria-label={openMobile || mode === "expanded" ? "Hide sidebar" : "Show sidebar"}
            aria-pressed={mode === "expanded"}
            onClick={() =>
              setMode(mode === "expanded" ? "hidden" : "expanded")
            }
          >
            {mode === "expanded" ? (
              <PanelLeftClose className='h-4 w-4' />
            ) : (
              <PanelLeft className='h-4 w-4' />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side='bottom'>
          {mode === "expanded" ? "Hide menu" : "Show menu"}
        </TooltipContent>
      </Tooltip>
    );
  }

  const ModeIcon =
    mode === "expanded" ? PanelLeft : mode === "icon" ? Columns2 : PanelLeftClose;

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='h-9 w-9 shrink-0'
              aria-label='Sidebar display'
            >
              <ModeIcon className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side='bottom'>Sidebar display</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align='start' className='w-48'>
        <DropdownMenuLabel>Sidebar</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={mode}
          onValueChange={(v) =>
            setMode(v as "expanded" | "icon" | "hidden")
          }
        >
          <DropdownMenuRadioItem value='expanded'>
            Full (labels)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='icon'>
            Icons only
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='hidden'>
            Hide
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
