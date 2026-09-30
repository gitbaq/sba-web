"use client";

import React from "react";
import Icons from "./Icons";
import { useTheme } from "@wrksz/themes/client";
import { TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Tooltip } from "@radix-ui/react-tooltip";

/** Compact light ↔ dark control for the top bar. Light is the product default. */
export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type='button'
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className='inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-accent/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        >
          {isDark ? (
            <Icons.FaSun className='h-3.5 w-3.5' aria-hidden />
          ) : (
            <Icons.FaMoon className='h-3.5 w-3.5' aria-hidden />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side='bottom'>
        {isDark ? "Light" : "Dark"}
      </TooltipContent>
    </Tooltip>
  );
}
