"use client";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { bucket_url_public } from "@/utils/endpoints/endpoints";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
// import LogoutButton from "@/app/(auth)/logout/LogoutButton";

export default function Usernav() {
  const router = useRouter();
  function handleClick(): void {
    router.push("/login");
  }

  return (
    <div className='flex flex-row items-center justify-center gap-2 '>
      <div className='flex flex-row gap-1 items-center'></div>
      <Tooltip>
        <TooltipContent>User Profile</TooltipContent>
        <TooltipTrigger>
          <Avatar onClick={handleClick}>
            <AvatarImage
              src={`${bucket_url_public}/profile_sba.jpg`}
              className='w-8 h-8 min-h-8 min-w-8 rounded-full hover:cursor-pointer hover:border-2 hover:border-amber-400'
            />
            <AvatarFallback>SBA</AvatarFallback>
          </Avatar>
        </TooltipTrigger>
      </Tooltip>
      {/* <Tooltip>
        <TooltipContent>Logout</TooltipContent>
        <TooltipTrigger>
          <LogoutButton />
        </TooltipTrigger>
      </Tooltip> */}
    </div>
  );
}
