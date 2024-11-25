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

export default function NavigationMenuDemo() {
  return (
    <NavigationMenu className='max-w-100 text-stone-800 justify-between h-24 md:min-h-24 min-h-12 shadow-sm'>
      <Link href='/' className='w-2/5'>
        <Brand />
      </Link>
      <Link href='/' className='md:px-5 w-1/5 content-center md:flex hidden'>
        Innovate. Lead. Succeed.
      </Link>
      <div className='flex flex-row md:gap-3 md:w-2/5 w-3/5 md:justify-end justify-center'>
        <Socials />

        <div className='ml-5 gap-3 md:flex flex-row px-5 hidden'>
          {/* <Link href='about' className='icons'>
            About
          </Link>*/}
          <Link href='courses' className='icons'>
            Courses
          </Link>
          {/* <Link href='contact' className='icons'>
            Contact
          </Link> */}
        </div>
        <div className='flex flex-row ml-5 md:hidden'>
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
                <Link href='courses'>Courses</Link>
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
