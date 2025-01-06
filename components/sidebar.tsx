"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { topics_url } from "@/utils/endpoints/endpoints";
import { Topic } from "@/types/types";
// import Brand from "../brand";
import { Suspense, useEffect, useState } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import Icons from "./Icons";
import Brand from "./brand";
import { toast } from "sonner";

function SearchResults() {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${topics_url}`);

        if (!response.ok) {
          setTopics([]);
          toast("We are working on it");
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const result = await response.json();

          setTopics(result);
        }
      } catch (e) {
        toast("Something is not right. We are working to fix it!");
        setTopics([]);
        throw new Error(`HTTP error! status: ${e}`);
      }
    };

    fetchData().catch((e) => {
      console.error("An error occurred while fetching the data: ", e);
    });
  }, []);

  return (
    <SidebarGroup className='overflow-y-auto'>
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
                            <a href={`/learning/${sub.id}`}>
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
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar variant='sidebar' className='shadow-none border-none'>
      <SidebarHeader className='flex flex-col justify-center w-full shadow-sm min-h-24 border-b bg-slate-800 text-slate-200'>
        <div className='flex flex-row items-center gap-2'>
          <Icons.Menu
            onClick={toggleSidebar}
            className='hover:cursor-pointer'
          />{" "}
          <Brand />
        </div>
      </SidebarHeader>
      <SidebarContent className='border-r border-slate-100'>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key='home'>
                <SidebarMenuButton asChild>
                  <a href={`/`}>
                    <Icons.House className='icons-size' />
                    <span>Home</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key='about'>
                <SidebarMenuButton asChild>
                  <a href={`/about`}>
                    <Icons.Info className='icons-size' />
                    <span>About</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key='learning'>
                <SidebarMenuButton asChild>
                  <a href={`/learning?query=transform`}>
                    <Icons.Library className='icons-size' />
                    <span>Learning</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key='contact'>
                <SidebarMenuButton asChild>
                  <a href={`/contact`}>
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
      </SidebarContent>
      <SidebarFooter className='text-slate-400 text-center border-t border-slate-100 min-h-24 h-24 justify-center'>
        {/* <Usernav /> */}&copy;syedbaqirali.com
      </SidebarFooter>
    </Sidebar>
  );
}
