"use client";
import React from "react";
import Icons from "./Icons";
import { useTheme } from "@wrksz/themes/client";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "./ui/tooltip";

const modes = [
  { id: "light" as const, label: "Light", Icon: Icons.FaSun },
  { id: "dark" as const, label: "Dark", Icon: Icons.FaMoon },
  { id: "system" as const, label: "System", Icon: Icons.MonitorCog },
];

function ThemeSelector() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const active = theme ?? "system";

  return (
    <div
      role='group'
      aria-label='Color theme'
      className='flex flex-row items-center gap-0.5'
    >
      {modes.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <Tooltip key={id}>
            <TooltipTrigger asChild>
              <button
                type='button'
                aria-label={`${label} theme`}
                aria-pressed={isActive}
                onClick={() => setTheme(id)}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isActive
                    ? "text-brand bg-brand-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/70"
                }`}
              >
                <Icon className='h-3.5 w-3.5' aria-hidden />
                <span className='sr-only'>
                  {label}
                  {isActive
                    ? ` (active${resolvedTheme ? `, resolved ${resolvedTheme}` : ""})`
                    : ""}
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent side='bottom'>{label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

export default ThemeSelector;
