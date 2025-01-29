"use client";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Icons from "./Icons";
import Brand from "./brand";
import { useSidebar } from "./ui/sidebar";

export default function NavbarBrand() {
  const { toggleSidebar } = useSidebar();
  return (
    <div className='flex flex-row w-2/5 items-center gap-1'>
      <Tooltip>
        <TooltipContent>Toggle Sidebar</TooltipContent>
        <TooltipTrigger>
          <Icons.Menu
            onClick={toggleSidebar}
            className='hover:cursor-pointer'
          />
        </TooltipTrigger>
      </Tooltip>

      <Brand />
    </div>
  );
}
