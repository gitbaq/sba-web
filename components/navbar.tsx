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

export default function Navbar() {
  return (
    <NavigationMenu
      className='flex flex-row min-w-full max-w-screen  text-slate-900 md:min-h-20 min-h-12 
      shadow-2xl shadow-slate-200 justify-between content-center items-center'
    >
      <Link
        href='/'
        className='flex flex-row heading items-center md:w-1/4 w-2/4 px-5'
      >
        <Brand />
      </Link>

      <div className='flex flex-row md:w-1/4 w-2/4 md:gap-3 gap-2 justify-end items-center px-5'>
        {/* <Socials />| */}
        <div className='md:flex flex-row hidden gap-3'>
          <Link href='/about' className='icons'>
            About
          </Link>{" "}
          |{" "}
          <Link href='/learning' className='icons'>
            Learning
          </Link>{" "}
          |{" "}
          <Link href='/contact' className='icons'>
            Contact
          </Link>
        </div>
        <div className='flex flex-row md:hidden'>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Icons.HiMiniBars3 />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link
                  href='/'
                  className='flex flex-row gap-3 items-center w-full'
                >
                  <Icons.Home />

                  <div>Home</div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href='/about'
                  className='flex flex-row gap-3 items-center w-full'
                >
                  <Icons.Info />

                  <div>About</div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href='/learning'
                  className='flex flex-row gap-3 items-center w-full'
                >
                  <Icons.Laptop />

                  <div>Learning</div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href='/contact'
                  className='flex flex-row gap-3 items-center w-full'
                >
                  <Icons.Mail />

                  <div>Contact</div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
