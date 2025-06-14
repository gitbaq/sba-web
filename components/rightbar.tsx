"use client";
import React from "react";

import Quote from "./quote";
import LinksPanel from "./LinksPanel";

export default function Rightbar() {
  return (
    <div className='flex flex-col space-y-5 p-2'>
      <div className='flex flex-col gap-5'>
        <Quote />
        <LinksPanel />
      </div>
    </div>
  );
}
