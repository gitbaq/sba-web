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
import ThemeComponent from "./ThemeComponent";

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className='flex flex-row gap-3 items-center text-lg h-full'>
      <div className='md:flex flex-row hidden gap-5 items-center justify-center h-full text-sm'>
        <Link
          href='/'
          className={`flex flex-row gap-2 items-center ${
            pathname === "/" ? "active_top" : ""
          } icons`}
        >
          <Icons.FaHouse className='icons-small' /> Home
        </Link>
        <Link
          href='/about'
          className={`flex flex-row gap-2 items-center ${
            pathname === "/about" ? "active_top" : ""
          } icons`}
        >
          <Icons.FaUserTie className='icons-small' /> About
        </Link>
        <Link
          href='/contact'
          className={`flex flex-row gap-2 items-center ${
            pathname === "/contact" ? "active_top" : ""
          } icons`}
        >
          <Icons.FaMessage className='icons-small' /> Contact
        </Link>
      </div>
      <div className='flex flex-row md:hidden'>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Icons.EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent className='bg-accent text-primary z-50 rounded p-3 w-fit min-w-fit text-sm'>
            <DropdownMenuItem>
              <Link
                href='/'
                className='flex flex-row gap-3 items-center w-full p-1 icons'
              >
                <Icons.FaHouse className='icons-size' />

                <div>Home</div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href='/about'
                className='flex flex-row gap-3 items-center w-full p-1 icons'
              >
                <Icons.FaUserTie className='icons-size' />
                <div>About</div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href='/learning'
                className='flex flex-row gap-3 items-center w-full p-1  icons'
              >
                <Icons.FaReadme className='icons-size' />

                <div>Learning</div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href='/contact'
                className='flex flex-row gap-3 items-center w-full p-1  icons'
              >
                <Icons.FaMessage className='icons-size' />

                <div>Contact</div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ThemeComponent />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
