"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/utils/AuthContext";
import {
  ADMIN_MANAGE_LINKS,
  ADMIN_NAV_SECTIONS,
  ADMIN_OVERVIEW_LINK,
} from "@/lib/adminNav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Icons from "@/components/Icons";

function linkActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

function useAdminLogout() {
  const { logout } = useAuth();
  return () => {
    logout();
    window.location.href = "/";
  };
}

/** Top-nav Manage dropdown for admin users. */
export default function ManageNav() {
  const { isAuthenticated, isAdmin } = useAuth();
  const pathname = usePathname();
  const onLogout = useAdminLogout();

  if (!isAuthenticated || !isAdmin) return null;

  const anyActive = ADMIN_MANAGE_LINKS.some((l) =>
    linkActive(pathname, l.href)
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`nav-link hidden md:inline-flex items-center gap-1 text-[13px] tracking-wide transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 min-h-11 ${
          anyActive
            ? "font-semibold text-foreground"
            : "text-muted-foreground"
        }`}
        aria-label='Manage site'
      >
        Manage
        <Icons.ChevronDown className='h-3.5 w-3.5 opacity-70' aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-64'>
        <DropdownMenuLabel>Admin</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={ADMIN_OVERVIEW_LINK.href}
            className={`flex flex-col items-start gap-0.5 w-full cursor-pointer ${
              linkActive(pathname, ADMIN_OVERVIEW_LINK.href) ? "bg-accent" : ""
            }`}
          >
            <span className='font-medium'>{ADMIN_OVERVIEW_LINK.menuLabel}</span>
            <span className='text-xs text-muted-foreground font-normal'>
              {ADMIN_OVERVIEW_LINK.description}
            </span>
          </Link>
        </DropdownMenuItem>
        {ADMIN_NAV_SECTIONS.map((section) => (
          <div key={section.id}>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className='text-xs text-muted-foreground'>
              {section.label}
            </DropdownMenuLabel>
            {section.links.map((l) => (
              <DropdownMenuItem key={l.href} asChild>
                <Link
                  href={l.href}
                  className={`flex flex-col items-start gap-0.5 w-full cursor-pointer ${
                    linkActive(pathname, l.href) ? "bg-accent" : ""
                  }`}
                >
                  <span className='font-medium'>{l.menuLabel}</span>
                  <span className='text-xs text-muted-foreground font-normal'>
                    {l.description}
                  </span>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className='cursor-pointer text-destructive focus:text-destructive'
        >
          <Icons.LogOut className='h-4 w-4' aria-hidden />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Mobile entries for the primary overflow menu. */
export function ManageNavMobileItems() {
  const { isAuthenticated, isAdmin } = useAuth();
  const onLogout = useAdminLogout();
  if (!isAuthenticated || !isAdmin) return null;

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuLabel className='text-xs text-muted-foreground'>
        Manage
      </DropdownMenuLabel>
      <DropdownMenuItem asChild>
        <Link href={ADMIN_OVERVIEW_LINK.href} className='w-full cursor-pointer'>
          {ADMIN_OVERVIEW_LINK.menuLabel}
        </Link>
      </DropdownMenuItem>
      {ADMIN_NAV_SECTIONS.map((section) => (
        <div key={section.id}>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className='text-xs text-muted-foreground'>
            {section.label}
          </DropdownMenuLabel>
          {section.links.map((l) => (
            <DropdownMenuItem key={l.href} asChild>
              <Link href={l.href} className='w-full cursor-pointer'>
                {l.menuLabel}
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
      ))}
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={onLogout}
        className='cursor-pointer text-destructive focus:text-destructive'
      >
        Log out
      </DropdownMenuItem>
    </>
  );
}
