"use client";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { bucket_url_public } from "@/utils/endpoints/endpoints";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { useAuth } from "@/utils/AuthContext";
import { usePathname } from "next/navigation";

export default function Usernav() {
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();
  const onLogin = pathname === "/login" || pathname.startsWith("/login/");

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  if (!isAuthenticated) {
    return (
      <Link
        href='/login'
        className={`inline-flex items-center rounded-md border border-border/80 px-2.5 py-1 text-[13px] tracking-wide transition-colors duration-150 hover:border-brand/40 hover:text-foreground hover:no-underline ${
          onLogin
            ? "border-brand/40 text-foreground font-medium"
            : "text-muted-foreground"
        }`}
      >
        Login
      </Link>
    );
  }

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email || "User";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='cursor-pointer'>
          <AvatarImage
            src={`${bucket_url_public}/profile_sba.jpg`}
            className='w-8 h-8 min-h-8 min-w-8 rounded-full hover:border-2 hover:border-brand'
          />
          <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className='hover:cursor-pointer'
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
