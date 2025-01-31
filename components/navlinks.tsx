import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import React from "react";
import Icons from "./Icons";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <div className='flex flex-row gap-3 items-start'>
      <div className='md:flex flex-row hidden gap-5 items-center justify-center '>
        <Link
          href='/'
          className={`${pathname === "/" ? "active_top" : ""} icons`}
        >
          {/* <Icons.House className='text-amber-400 icons-size' />  */}
          Home
        </Link>
        <Link
          href='/about'
          className={`${pathname === "/about" ? "active_top" : ""} icons`}
        >
          About
        </Link>
        <Link
          href='/contact'
          className={`${pathname === "/contact" ? "active_top" : ""} icons`}
        >
          Contact
        </Link>
        {/* <Link
          href='/learning?query=transform'
          className={`${pathname === "/learning" ? "active_top" : ""} icons`}
        >
          Learning
        </Link> */}
      </div>
      <div className='flex flex-row md:hidden'>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Icons.EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent className='bg-accent text-primary z-50 rounded p-2 w-32 min-w-32'>
            <DropdownMenuItem>
              <Link
                href='/'
                className='flex flex-row gap-3 items-center w-full p-1 icons'
              >
                <Icons.House className='icons-size' />

                <div>Home</div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href='/about'
                className='flex flex-row gap-3 items-center w-full p-1  icons'
              >
                <Icons.Info className='icons-size' />

                <div>About</div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href='/learning'
                className='flex flex-row gap-3 items-center w-full p-1  icons'
              >
                <Icons.Library className='icons-size' />

                <div>Learning</div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href='/contact'
                className='flex flex-row gap-3 items-center w-full p-1  icons'
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
