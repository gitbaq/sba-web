"use client";

import Link from "next/link";
import { useEffect, useState, type ComponentType } from "react";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Icons from "@/components/Icons";
import { ADMIN_MANAGE_LINKS } from "@/lib/adminNav";
import { readJson } from "@/lib/http";
import { SubTopic } from "@/types/types";
import { subtopics_url } from "@/utils/endpoints/endpoints";
import { useAdminSidebarMode } from "@/components/admin/AdminSidebarMode";

function navActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

function isPublishedFlag(flag: unknown): boolean {
  return flag === true || flag === "true" || flag === "1";
}

type IconComp = ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

const MANAGE_ICONS: Record<string, IconComp> = {
  "/admin": Icons.MonitorCog,
  "/admin/home": Icons.FaHouse,
  "/admin/essays": Icons.PencilLine,
  "/admin/series": Icons.Library,
  "/admin/work": Icons.FolderCode,
  "/admin/about": Icons.User,
  "/admin/newsletter": Icons.Mails,
};

function AdminNavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: IconComp;
  active: boolean;
}) {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} tooltip={label}>
        <Link
          href={href}
          onClick={() => {
            if (isMobile) setOpenMobile(false);
          }}
        >
          <Icon className='h-4 w-4' aria-hidden />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

/** Left rail on /admin and /editor. Essay list only in full (expanded) mode. */
export default function AdminSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile, state } = useSidebar();
  const { mode } = useAdminSidebarMode();
  const [posts, setPosts] = useState<SubTopic[]>([]);

  const showEssayList =
    isMobile || (mode === "expanded" && state === "expanded");

  useEffect(() => {
    if (!showEssayList) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(subtopics_url);
        if (!res.ok) return;
        const data = await readJson<SubTopic[]>(res, []);
        if (cancelled) return;
        const list = (Array.isArray(data) ? data : []).sort((a, b) => {
          const at = Date.parse(a.updateDate || a.publishDate || "") || 0;
          const bt = Date.parse(b.updateDate || b.publishDate || "") || 0;
          return bt - at;
        });
        setPosts(list);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showEssayList]);

  return (
    <Sidebar
      title='Admin'
      variant='sidebar'
      collapsible='icon'
      className='border-r'
    >
      <SidebarContent className='pt-16 gap-1'>
        <SidebarGroup className='py-1'>
          <SidebarGroupLabel className='sidebar-group-labels'>
            Manage
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ADMIN_MANAGE_LINKS.map((l) => {
                const Icon = MANAGE_ICONS[l.href] || Icons.Settings2;
                // In icon mode, Essays covers /editor too (essay list is hidden).
                const active =
                  l.href === "/admin/essays"
                    ? navActive(pathname, l.href) ||
                      pathname.startsWith("/editor")
                    : navActive(pathname, l.href);
                return (
                  <AdminNavLink
                    key={l.href}
                    href={l.href}
                    label={l.label}
                    icon={Icon}
                    active={active}
                  />
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {showEssayList ? (
          <SidebarGroup className='overflow-y-auto min-h-0 flex-1 py-1'>
            <SidebarGroupLabel className='sidebar-group-labels'>
              Edit essays
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {posts.length === 0 && (
                  <SidebarMenuItem>
                    <span className='px-2 text-xs text-muted-foreground'>
                      No essays loaded.
                    </span>
                  </SidebarMenuItem>
                )}
                {posts.map((post) => {
                  const href = `/editor/${post.id}`;
                  const active =
                    pathname === href || pathname.startsWith(`${href}/`);
                  const published = isPublishedFlag(post.isPublished);
                  const title = post.subHeading || post.heading;
                  return (
                    <SidebarMenuItem key={post.id}>
                      <SidebarMenuButton asChild isActive={active}>
                        <Link
                          href={href}
                          title={title}
                          onClick={() => {
                            if (isMobile) setOpenMobile(false);
                          }}
                        >
                          <Icons.PencilLine
                            className='h-4 w-4 shrink-0'
                            aria-hidden
                          />
                          <span className='truncate'>
                            {title}
                            {!published ? " (draft)" : ""}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}

        <SidebarGroup className='mt-auto py-1'>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip='View public writing'>
                  <Link
                    href='/writing'
                    onClick={() => {
                      if (isMobile) setOpenMobile(false);
                    }}
                  >
                    <Icons.BookOpen className='h-4 w-4' aria-hidden />
                    <span>View public writing</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {!isMobile && mode !== "hidden" ? <SidebarRail /> : null}
    </Sidebar>
  );
}
