"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Topic } from "@/types/types";
import { Suspense, useEffect, useState } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import Icons from "./Icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Search from "./search";
import ThemeSelector from "./ThemeSelector";
import { getAllTopics } from "@/utils/services/getAllTopics";
import NavbarBrand from "./navbarbrand";

function SearchResults() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      setTopics(await getAllTopics());
    };

    fetchData().catch((e) => {
      console.error("An error occurred while fetching the data: ", e);
    });
  }, []);

  return (
    <SidebarGroup className='overflow-y-scroll h-full'>
      <Search />
      <SidebarHeader>
        <SidebarGroupLabel className='text-sm font-semibold p-0'>
          <div className='flex flex-row w-full items-baseline justify-between'>
            <span>Reading List</span>
            <Link href='/learning?query=transform' className='px-1'>
              <Icons.ExternalLink
                className={`icons-size ${
                  pathname === "/learning" ? " text-amber-500 " : ""
                }`}
              />
            </Link>
          </div>
        </SidebarGroupLabel>
      </SidebarHeader>
      <SidebarGroupContent>
        <SidebarMenu>
          {topics?.map((item) => (
            <div key={item.id}>
              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton asChild>
                      <div className='flex flex-row lead_text font-semibold'>
                        <Icons.BookOpen strokeWidth={2} />
                        <span>{item.sbaTopicName}</span>
                      </div>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className='tooltips'>{item.sbaTopicName}</div>
                  </TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
              <div>
                {item.subTopicList.map((sub) => (
                  <div key={sub.id}>
                    <SidebarMenuItem>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton asChild>
                            <a
                              href={`/learning/${sub.id}`}
                              className={`${
                                pathname === "/learning/" + sub.id
                                  ? "active"
                                  : ""
                              }`}
                            >
                              <Icons.Text strokeWidth={2} />
                              <span>{sub.heading}</span>
                            </a>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent className='tooltips'>
                          <div>
                            <span className=' text-sky-800'>{sub.heading}</span>
                            <br />
                            {sub.subHeading}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function LearningSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant='sidebar' className='border-none h-maxscr2 absolute'>
      <SidebarHeader className='p-4  border-b border-accent  bg-white dark:bg-slate-950'>
        <NavbarBrand />
      </SidebarHeader>
      <SidebarContent className=' bg-white dark:bg-slate-950'>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key='home'>
                <SidebarMenuButton asChild>
                  <a
                    href={`/`}
                    className={`${pathname === "/" ? "active" : ""}`}
                  >
                    <Icons.House className='icons-size' />
                    <span>Home</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key='about'>
                <SidebarMenuButton asChild>
                  <Link
                    href={`/about`}
                    className={`${pathname === "/about" ? "active" : ""}`}
                  >
                    <Icons.Info className='icons-size' />
                    <span>About</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem key='contact'>
                <SidebarMenuButton asChild>
                  <a
                    href={`/contact`}
                    className={`${pathname === "/contact" ? "active" : ""}`}
                  >
                    <Icons.MessageSquareCode />
                    <span>Contact</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Suspense>
          <SearchResults />
        </Suspense>
        <SidebarFooter>
          <ThemeSelector />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
