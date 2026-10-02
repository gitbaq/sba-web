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
import { useAuth } from "@/utils/AuthContext";

/** Public Login lives in the footer (P1-15). Header only shows account when signed in. */
export default function Usernav() {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email || "User";

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='cursor-pointer'>
          <AvatarImage
            src={`${bucket_url_public}/profile_sba.jpg`}
            className='h-8 w-8 min-h-8 min-w-8 rounded-full hover:border-2 hover:border-brand'
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
