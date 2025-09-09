"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
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
// import Search from "./search";

import { getAllTopics } from "@/utils/services/getAllTopics";
import Link from "next/link";
import Search from "./search";
import { blox_url, cobu_url } from "@/utils/endpoints/endpoints";
import Image from "next/image";
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
                            <Link
                              href={`/learning/${sub.id}`}
                              className={`${
                                pathname === "/learning/" + sub.id
                                  ? "active"
                                  : ""
                              }`}
                            >
                              <Icons.Text strokeWidth={1} />
                              <span>{sub.heading}</span>
                            </Link>
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
    <Sidebar title="Syed's Notes" variant='sidebar' className='border-r h-full'>
      <SidebarContent className='pt-16'>
        <div className='sr-only'>Syed&apos;s Notes</div>
        <SidebarGroup className='font-semibold text-cyan-600 dark:text-cyan-400 '>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton asChild>
                      <div className='flex flex-row hover:text-cyan-800 hover:dark:text-cyan-300'>
                        <Image
                          className='rounded-full'
                          src={cobu_url + "/cb-logo.png"}
                          alt='Visit Cobu: AI Agent'
                          width={20}
                          height={20}
                          priority
                        />
                        <Link href={cobu_url} target='_cobu'>
                          Cobu: AI Agent
                        </Link>
                      </div>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side='right'>
                    <div className='tooltips'>
                      Click here to visit Cobu: AI Agent
                    </div>
                  </TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton asChild>
                      <div className='flex flex-row  hover:text-cyan-800 hover:dark:text-cyan-300'>
                        <Image
                          className='rounded-full'
                          src='/logos/blox.png'
                          alt='Visit Cobu: AI Agent'
                          width={20}
                          height={20}
                          priority
                        />
                        <Link href={blox_url} target='_blox'>
                          Blox: Productivity
                        </Link>
                      </div>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side='right'>
                    <div className='tooltips'>Click here to visit Blox</div>
                  </TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton asChild>
                      <div className='flex flex-row text-cyan-800 dark:text-cyan-300 hover:text-cyan-700 hover:dark:text-cyan-400'>
                        <Icons.Bookmark strokeWidth={2} />
                        <Link href='/learning?query=nlp'>
                          View Recent Posts
                        </Link>
                      </div>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side='right'>
                    <div className='tooltips'>
                      Click here to view Recent Posts
                    </div>
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
