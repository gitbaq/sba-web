"use client";

import * as React from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import Brand from "./brand";
import Icons from "./Icons";
import Socials from "./socials";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import Subscribe from "./subscribe";

export default function Navbar() {
  return (
    <NavigationMenu
      className='flex flex-row min-w-full max-w-screen  text-cyan-700 h-24 md:min-h-32 min-h-20 
      shadow-sm justify-between content-center items-center'
    >
      <Link
        href='/'
        className='flex flex-row heading items-center md:w-1/4 w-2/4 px-5'
      >
        <Brand />
      </Link>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href='/'
            className='min-h-full w-1/4 hover:text-cyan-800 md:px-5 justify-center items-center md:flex hidden sub-heading'
          >
            Innovate. Lead. Succeed.
          </Link>
        </TooltipTrigger>
        <TooltipContent className='tooltip'>Home</TooltipContent>
      </Tooltip>
      <div className='flex flex-row md:w-1/4 w-2/4 md:gap-3 gap-2 md:justify-end justify-center items-center px-3'>
        <Socials />|
        <div className='md:flex flex-row hidden'>
          {/* <Link href='about' className='icons'>
            About
          </Link>*/}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href='/learning'
                className='icons_diff text-2xl text-pink-800'
              >
                <Icons.GiBookshelf />
              </Link>
            </TooltipTrigger>
            <TooltipContent className='tooltip'>
              Visit my Learning Collections
            </TooltipContent>
          </Tooltip>
          {/* <Link href='contact' className='icons'>
            Contact
          </Link> */}
        </div>
        <div className='flex flex-row md:hidden'>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Icons.HiMiniBars3 />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* <DropdownMenuItem>
                <Link href='about'>About</Link>
              </DropdownMenuItem> */}
              {/* <DropdownMenuLabel>
              <Link href='about'>About</Link>
            </DropdownMenuLabel> */}
              {/* <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href='blog'>Blog</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href='contact'>Contact</Link>
              </DropdownMenuItem> */}
              <DropdownMenuItem>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href='learning'
                        className='icons_diff text-2xl text-pink-800'
                      >
                        <Icons.GiBookshelf />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Visit my Learning Collections</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        |<Subscribe />
      </div>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className='text-sm font-medium leading-none'>{title}</div>
          <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
