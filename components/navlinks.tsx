"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import React from "react";
import Icons from "./Icons";
import { usePathname } from "next/navigation";
import ThemeToggleComponent from "./ThemeToggleComponent";
import { ManageNavMobileItems } from "./ManageNav";
import { PRIMARY_NAV } from "@/lib/siteShell";

function linkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className='flex flex-row gap-3 items-center text-lg h-full'>
      <nav
        aria-label='Primary'
        className='md:flex flex-row hidden gap-5 items-center justify-center h-full text-sm'
      >
        {PRIMARY_NAV.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`nav-link relative flex flex-row gap-2 items-center text-[13px] tracking-wide transition-colors duration-150 ${
              "emphasize" in l && l.emphasize
                ? "font-semibold text-brand"
                : "text-muted-foreground"
            } ${linkActive(pathname, l.href) && !("emphasize" in l && l.emphasize) ? "active_top !text-foreground" : ""}`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className='flex flex-row md:hidden'>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label='Open menu'
            className='p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          >
            <Icons.EllipsisVertical aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent className='bg-card text-foreground border border-border z-50 rounded-md p-2 w-48 shadow-md text-sm'>
            {PRIMARY_NAV.map((l) => (
              <DropdownMenuItem key={l.href} asChild>
                <Link
                  href={l.href}
                  className={`flex flex-row gap-3 items-center w-full p-2 rounded icons ${
                    "emphasize" in l && l.emphasize ? "font-semibold text-brand" : ""
                  }`}
                >
                  {l.label}
                </Link>
              </DropdownMenuItem>
            ))}
            <ManageNavMobileItems />
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className='focus:bg-transparent'
            >
              <ThemeToggleComponent />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
