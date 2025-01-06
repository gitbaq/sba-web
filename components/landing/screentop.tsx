import React from "react";
import Image from "next/image";
import Subscribe from "../subscribe";

const ScreenTop = () => {
  return (
    <div
      className='flex md:flex-row flex-col md:gap-10 gap-10 md:items-center items-center
    p-5'
    >
      <div className='rounded-ss-full bg-gradient-to-b bg-amber-400 p-3'>
        <Image
          className='from-neutral-800 via-neutral-400 to-inherit opacity-80'
          src='/ai4.png'
          alt='AI'
          width={320}
          height={320}
          priority
        />
      </div>

      <div
        className='flex flex-col h-full w-full md:w-2/4 
      justify-center gap-3 rounded hover:shadow-sm'
      >
        <div className='flex flex-col justify-center items-center sub-heading rounded-t-lg p-3 '>
          <div className='focus'>Your Future</div>
          <div>Powered by Innovation</div>
        </div>

        <div className='px-2 max-w-sm'>
          AI is no longer a luxury—it`s a necessity. Take the leap into a
          promising future and position your business as a leader in your
          industry.
        </div>
        <div className='quote px-2'>
          &quot; Innovation distinguishes between a leader and a
          follower.&quot;&nbsp;- Steve Jobs
        </div>
        <div className='px-2'>
          Ready to lead? Let`s build your AI-driven future today.
        </div>
        <div className='flex flex-row w-full'>
          <Subscribe />
          &nbsp;
        </div>
      </div>
    </div>
  );
};

export default ScreenTop;
