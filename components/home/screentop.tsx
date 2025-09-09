import React from "react";
import Image from "next/image";
import Subscribe from "../subscribe";
import Icons from "../Icons";

const ScreenTop = () => {
  return (
    <div
      className='flex md:flex-row flex-col md:gap-10 min-h-fit h-fit
    p-5 max-w-4xl lg:bg-gradient-to-r bg-gradient-to-b from-amber-200 via-amber-50 to-cyan-100 rounded-2xl'
    >
      <div className='flex items-center justify-center rounded-ss-full bg-gradient-to-b from-amber-500 to-amber-400 p-3'>
        <Image
          className='from-neutral-800 via-neutral-400 to-inherit opacity-80 z-10'
          src='/ai4.png'
          alt='AI'
          width={320}
          height={320}
          priority
        />
      </div>

      <div className='flex flex-col w-full md:w-2/4 justify-center items-center text-gray-950'>
        <div className='flex flex-col sub-heading w-full'>
          <div className='heading text-center w-full md:py-0 pt-5'>
            Your Future
          </div>
          <div className=' w-full text-center'>Powered by Innovation</div>
        </div>

        <div className='p-2 max-w-sm'>
          AI is no longer a luxury—it`s a necessity. Take the leap into a
          promising future and position your business as a leader in your
          industry.
        </div>
        <div className='flex flex-row gap-1 p-5'>
          <Icons.FaQuoteLeft className='text-cyan-600 min-h-4 min-w-4' />{" "}
          Innovation distinguishes between a leader and a follower - Steve Jobs
        </div>
        <div className='p-3 text-cyan-900'>
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
