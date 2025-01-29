"use client";
import React from "react";

import Link from "next/link";
import Icons from "@/components/Icons";

const LogoutButton = () => {
  return (
    // <Button onClick={() => redirect("/logout")}>Logout!</Button>
    <Link href='/logout' className='hover:cursor-pointer'>
      <Icons.LogOut className='icons-size' />
    </Link>
  );
};

export default LogoutButton;
