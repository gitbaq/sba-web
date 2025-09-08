"use client";
import React from "react";

import Brand from "./brand";

export default function NavbarBrand() {
  return (
    <div className='flex flex-row max-w-1/2 justify-center h-full items-center gap-1'>
      <Brand />
    </div>
  );
}
