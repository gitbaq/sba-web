"use client";
// import Link from "next/link";
import React from "react";
// import Icons from "../Icons";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { toast } from "sonner";
import { bucket_url_public } from "@/utils/endpoints/endpoints";

export default function Usernav() {
  function handleClick(): void {
    toast("This is an important message.");
  }

  return (
    <div className='flex flex-row items-center justify-center gap-2 '>
      {/* <Link href='/editor' className='flex flex-row action-button'>
        <Icons.Plus className='text-amber-400 icons-size' />
        Create
      </Link> */}
      <Avatar onClick={handleClick}>
        <AvatarImage
          src={`${bucket_url_public}/profile_sba.jpg`}
          className='w-8 h-8 rounded-full hover:cursor-pointer hover:border-2 hover:border-amber-400'
        />
        <AvatarFallback>SBA</AvatarFallback>
      </Avatar>
    </div>
  );
}
