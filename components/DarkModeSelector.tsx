import React from "react";
import Icons from "./Icons";
import { useTheme } from "next-themes";

function DarkModeSelector() {
  const { /*systemTheme,*/ theme, setTheme } = useTheme();
  // const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <>
      <Icons.SunDim
        onClick={() => setTheme("light")}
        className={`${
          theme === "light" ? "text-cyan-500" : ""
        } icons-small hover:cursor-pointer`}
      />
      <Icons.Moon
        onClick={() => setTheme("dark")}
        className={`${
          theme === "dark" ? "text-cyan-500" : ""
        } icons-small hover:cursor-pointer`}
      />
      <Icons.MonitorCog
        onClick={() => setTheme("system")}
        className={`${
          theme === "system" ? "text-cyan-500" : ""
        } icons-small hover:cursor-pointer`}
      />
    </>
  );
}

export default DarkModeSelector;
