import React from "react";
import Icons from "./Icons";
export default function FormMessages({
  error,
  success,
}: {
  error: string | null;
  success: string | null;
}) {
  return (
    <>
      {success && (
        <div className='flex flex-row items-center gap-2 p-3 border-b border-accent  w-full text-wrap'>
          <Icons.CircleCheckBig className=' text-green-600' /> {success}
        </div>
      )}
      {error && (
        <div className='flex flex-row items-center gap-2 p-3 border-b border-accent w-full  '>
          <Icons.CircleX className='text-red-500 dark:text-red-200' /> {error}
        </div>
      )}
    </>
  );
}
