"use client";
import React from "react";
import Icons from "./Icons";
import { useTheme } from "next-themes";
// import { cn } from "@/lib/utils";

function ThemeSelector() {
  const { /*systemTheme,  theme,*/ setTheme } = useTheme();
  // const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className='flex flex-row items-center gap-1'>
      <Icons.SunDim
        onClick={() => setTheme("light")}
        className='icons-small hover:cursor-pointer'

        // className={`icons-small hover:cursor-pointer ${
        //   theme === "light" ? "text-cyan-500" : ""
        // }`}
      />
      <Icons.Moon
        onClick={() => setTheme("dark")}
        className='icons-small hover:cursor-pointer'
      />
      <Icons.MonitorCog
        onClick={() => setTheme("system")}
        className='icons-small hover:cursor-pointer'
      />
    </div>
  );
}

export default ThemeSelector;
