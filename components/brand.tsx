import React from "react";
import Link from "next/link";
import BrandMark from "./BrandMark";

const Brand = () => {
  return (
    <Link
      href='/'
      className='flex flex-row gap-2.5 h-full items-center hover:no-underline min-w-0'
      aria-label='Syed Baqir Ali — home'
    >
      <BrandMark className='h-8 w-8 shrink-0' />
      <span className='font-display text-xl md:text-2xl text-nowrap tracking-tight font-semibold text-foreground'>
        Syed <span className='text-muted-foreground'>Baqir Ali</span>
      </span>
    </Link>
  );
};

export default Brand;
