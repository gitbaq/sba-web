"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
import {
  blox_url,
  cobu_url,
  substack_image_url,
  substack_url,
} from "@/utils/endpoints/endpoints";
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
      <SidebarGroupLabel className='sidebar-group-labels'>
        ARTICLES
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <div className='p-0.5 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm'>
            <Search />
          </div>
          {topics?.map((item) => (
            <div key={item.id}>
              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton asChild>
                      <div className='flex flex-row font-bold'>
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
                                  ? "active-article"
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
    <Sidebar
      title='Syed Baqir Ali (www.syedbaqirli.com)'
      variant='sidebar'
      className='border-r h-full'
    >
      <SidebarContent className='pt-16'>
        <div className='sr-only'>Syed&apos;s Notes</div>
        <SidebarGroup className='text-gray-700 dark:text-gray-200 '>
          <SidebarGroupLabel className='sidebar-group-labels'>
            PROJECTS
          </SidebarGroupLabel>
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
                          Cobu: AI RAG Agent
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
                      <div className='flex flex-row hover:text-cyan-800 hover:dark:text-cyan-300'>
                        <Image
                          src={substack_image_url}
                          width={20}
                          height={20}
                          alt='Reasoning Stack Magazine'
                        />
                        <Link href={substack_url} target='_blox'>
                          The Reasoning Stack (Blog)
                        </Link>
                      </div>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side='right'>
                    <div className='tooltips'>
                      Click here to visit The Reasoning Stack - My Blog and
                      Newsletter
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
