import React from "react";
import Link from "next/link";
import Icons from "./Icons";

const Brand = () => {
  return (
    <div className='flex flex-row gap-3 h-full items-center'>
      <span>
        <Icons.Bot className='text-amber-500' strokeWidth={3} size='32' />
      </span>
      <Link
        href='/'
        className='items-center font-russo text-3xl text-nowrap gap-1 hover:no-underline'
      >
        Syed <span className='text-slate-500'>Baqir Ali</span>
      </Link>
    </div>
  );
};

export default Brand;
