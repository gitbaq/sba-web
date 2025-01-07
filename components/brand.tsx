import React from "react";
import Link from "next/link";
import Icons from "./Icons";

const Brand = () => {
  return (
    <div className='flex flex-row items-center gap-2  h-8 min-h-8'>
      <Icons.Bot className=' text-amber-500' strokeWidth={3} />
      <Link
        href='/'
        className='flex flex-row items-center font-russo text-xl text-nowrap gap-1 hover:no-underline'
      >
        Syed <div className='text-slate-500'>B</div>
      </Link>
    </div>
  );
};

export default Brand;
