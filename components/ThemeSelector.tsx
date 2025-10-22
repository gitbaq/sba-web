"use client";
import React, { useEffect } from "react";
import Icons from "./Icons";
import { useTheme } from "next-themes";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "./ui/tooltip";

function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    if (theme === "" || theme === null) {
      setTheme("system");
    } else {
      setTheme(theme + "");
    }
  }, [setTheme, theme]);

  return (
    <div className='flex flex-row gap-4 p-3 justify-center border border-accent rounded-full bg-red-100 dark:bg-opacity-10 text-sm'>
      <Tooltip>
        <TooltipTrigger asChild>
          <Icons.FaSun
            onClick={() => setTheme("light")}
            className={`icons-small hover:cursor-pointer ${
              theme === "light" ? "text-amber-500" : ""
            }`}
          />
        </TooltipTrigger>
        <TooltipContent>Light</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Icons.FaMoon
            onClick={() => setTheme("dark")}
            className={` icons-small hover:cursor-pointer ${
              theme === "dark" ? "text-amber-500" : ""
            }`}
          />
        </TooltipTrigger>
        <TooltipContent>Dark</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Icons.MonitorCog
            onClick={() => setTheme("system")}
            className={`icons-small hover:cursor-pointer ${
              theme === "system" ? "text-amber-500" : ""
            }`}
          />
        </TooltipTrigger>
        <TooltipContent>System</TooltipContent>
      </Tooltip>
    </div>
  );
}

export default ThemeSelector;
