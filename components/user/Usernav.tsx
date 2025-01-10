"use client";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { toast } from "sonner";
import { bucket_url_public } from "@/utils/endpoints/endpoints";
import Link from "next/link";
import Icons from "../Icons";
import { useRouter } from "next/navigation";

export default function Usernav() {
  const router = useRouter();
  function handleClick(): void {
    toast("Logging in...");
    router.push("/login");
  }

  return (
    <div className='flex flex-row items-center justify-center gap-2 '>
      {/* <Link href='/editor' className='flex flex-row action-button'>
        <Icons.Plus className='text-amber-400 icons-size' />
        Create
      </Link> */}
      <Link href='#' className='flex flex-row'>
        <Icons.Bell className='text-amber-400 icons-size' />
      </Link>
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
