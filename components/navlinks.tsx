import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import React from "react";
import Icons from "./Icons";

export default function NavLinks() {
  return (
    <div className='flex flex-row gap-3 items-center'>
      <div className='md:flex flex-row hidden gap-3 items-center'>
        <Link href='/about' className='icons'>
          About
        </Link>
        <Link href='/learning?query=transform' className='icons'>
          Learning
        </Link>
        <Link href='/contact' className='icons'>
          Contact
        </Link>
      </div>
      <div className='flex flex-row md:hidden'>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Icons.EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent className='bg-slate-100 text-slate-900 rounded p-2 w-32 min-w-32'>
            <DropdownMenuItem>
              <Link
                href='/'
                className='flex flex-row gap-3 items-center w-full p-1'
              >
                <Icons.House className='icons-size' />

                <div>Home</div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href='/about'
                className='flex flex-row gap-3 items-center w-full p-1'
              >
                <Icons.Info className='icons-size' />

                <div>About</div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href='/learning'
                className='flex flex-row gap-3 items-center w-full p-1'
              >
                <Icons.Library className='icons-size' />

                <div>Learning</div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href='/contact'
                className='flex flex-row gap-3 items-center w-full p-1'
              >
                <Icons.MessageSquareCode className='icons-size' />

                <div>Contact</div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
