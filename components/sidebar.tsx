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
import { usePathname } from "next/navigation";
import Search from "./search";

import { getAllTopics } from "@/utils/services/getAllTopics";
import NavbarTrigger from "./NavbarTrigger";
import Link from "next/link";

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
      <SidebarGroupContent>
        <Search />
        <SidebarMenu className='mt-5'>
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
  return (
    <Sidebar
      title="Syed's Notes"
      variant='sidebar'
      className='border-none absolute h-full min-h-full'
    >
      <SidebarHeader className='p-4'>
        <NavbarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className='py-0'>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton asChild>
                      <div className='flex flex-row text-amber-600 dark:text-amber-400 font-semibold text-lg'>
                        <Icons.Bookmark strokeWidth={2} />
                        <Link href='/learning?query=nlp'>Recent Posts</Link>
                      </div>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side='right'>
                    <div className='tooltips'>Recent Notes</div>
                  </TooltipContent>
                </Tooltip>
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
