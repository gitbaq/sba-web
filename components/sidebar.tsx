"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
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
      {/* <SidebarHeader className='flex flex-row items-center justify-between'>
        <Link
          href='/learning?query=transform'
          className='flex flex-row gap-1 items-center font-bold icons'
        >
          <Icons.Bookmark className=' text-amber-600 icons-size' />
          <span>Reading List</span>
        </Link>
        <Icons.ExternalLink className='icons-size' />
      </SidebarHeader> */}
      <SidebarGroupContent>
        <Search />
        <SidebarMenu>
          {topics?.map((item) => (
            <div key={item.id}>
              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton asChild>
                      <div className='flex flex-row lead_text font-semibold text-lg'>
                        <Icons.BookOpen strokeWidth={2} />
                        <span>{item.sbaTopicName}</span>
                      </div>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side='right'>
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
                              <Icons.Text strokeWidth={1} />
                              <span>{sub.heading}</span>
                            </a>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent className='tooltips' side='right'>
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
    <Sidebar
      variant='sidebar'
      className='border-none absolute h-full min-h-full'
    >
      <SidebarHeader className='p-4'>
        <NavbarBrand />
      </SidebarHeader>
      <SidebarContent>
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
              <SidebarMenuItem key='learning'>
                <SidebarMenuButton asChild>
                  <a
                    href={`/learning?query=transform`}
                    className={`${pathname === "/learning" ? "active" : ""}`}
                  >
                    <Icons.Bookmark className='icons-size text-amber-600' />
                    <span>Reading List</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Suspense>
          <SearchResults />
        </Suspense>
      </SidebarContent>
    </Sidebar>
  );
}
