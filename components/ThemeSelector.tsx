"use client";
import React from "react";
import Icons from "./Icons";
import { useTheme } from "next-themes";
// import { cn } from "@/lib/utils";

function ThemeSelector() {
  const { /*systemTheme,  */ theme, setTheme } = useTheme();
  // const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div
      className='flex flex-row items-center gap-4 
    p-2 py-3 rounded justify-center bg-gradient-to-br from-transparent via-accent to-transparent'
    >
      <Icons.SunDim
        onClick={() => setTheme("light")}
        className={` icons-small hover:cursor-pointer ${
          theme === "light" ? "text-cyan-500" : ""
        }`}
      />
      <Icons.Moon
        onClick={() => setTheme("dark")}
        className={` icons-small hover:cursor-pointer ${
          theme === "dark" ? "text-cyan-500" : ""
        }`}
      />
      <Icons.MonitorCog
        onClick={() => setTheme("system")}
        className={` icons-small hover:cursor-pointer ${
          theme === "system" ? "text-cyan-500" : ""
        }`}
      />
    </div>
  );
}

export default ThemeSelector;
