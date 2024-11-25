import Icons from "@/components/Icons";
import React from "react";

const page = () => {
  return (
    <div className='m-5 flex flex-row heading items-center'>
      Working on adding new courses...
      <Icons.GrInProgress className='animate-pulse text-yellow-300' />
    </div>
  );
};

export default page;
