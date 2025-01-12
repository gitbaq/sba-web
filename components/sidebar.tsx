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
  SidebarSeparator,
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
import Link from "next/link";
import { usePathname } from "next/navigation";
import Search from "./search";
import DarkModeSelector from "./DarkModeSelector";
import Copyright from "./Copyright";

function SearchResults() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const pathname = usePathname();

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
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  return (
    <Sidebar variant='sidebar' className='shadow-md border-none'>
      <SidebarHeader className='flex flex-col justify-center w-full shadow-sm min-h-16 border-b bg-slate-900 text-slate-200'>
        <div className='flex flex-row items-center gap-2'>
          <Icons.Menu
            onClick={toggleSidebar}
            className='hover:cursor-pointer'
          />{" "}
          <Brand />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <Search />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key='home'>
                <SidebarMenuButton asChild>
                  <a
                    href={`/`}
                    className={`${pathname === "/" ? "active" : ""}`}
                  >
                    <Icons.House className='icons-size text-amber-600' />
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
              <SidebarSeparator />
              <SidebarMenuItem key='learning'>
                <SidebarMenuButton asChild>
                  <a
                    href={`/learning?query=transform`}
                    className={`${pathname === "/learning" ? "active" : ""}`}
                  >
                    <Icons.Library className='icons-size' />
                    <span>Learning</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarSeparator />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Suspense>
          <SearchResults />
        </Suspense>
      </SidebarContent>
      <SidebarFooter className='text-center border-t text-xs border-slate-100 dark:border-slate-600 min-h-24 h-24 justify-center'>
        <div className='flex flex-row gap-2 items-center justify-center w-full p-2 bg-accent rounded-full text-primary border border-accent'>
          <DarkModeSelector />
        </div>
        <Copyright />
      </SidebarFooter>
    </Sidebar>
  );
}
