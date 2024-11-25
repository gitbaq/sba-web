import React from "react";
import Image from "next/image";

const ScreenTop = () => {
  return (
    <div
      className='flex md:flex-row flex-col h-full w-full md:items-center items-start 
    bg-gradient-to-b from-transparent via-stone-400 to-transparent
    md:px-10 p-2 justify-between'
    >
      {/* // bg-gradient-to-b from-transparent via-stone-400 to-transparent */}
      <div className='h-full w-full md:w-2/4 content-center'>
        <div className='heading'>
          <span className='font-ruthie'>Your Future</span>
          <br />
          Powered by Innovation
        </div>

        <div className='p-5'>
          AI is no longer a luxury—it`s a necessity. From predictive analytics
          to personalized customer experiences, we tailor solutions to fit your
          unique needs. Take the leap into the future and position your business
          as a leader in your industry.
        </div>
        <div className='quote'>
          &quot; Innovation distinguishes between a leader and a follower.&quot;
          - Steve Jobs
        </div>
        <div>Ready to lead? Let`s build your AI-driven future today.</div>
      </div>
      <div className='h-full w-fit'>
        <Image
          className='rounded-lg'
          src='/sba-green.png'
          alt='Next.js logo'
          width={500}
          height={500}
          priority
        />
      </div>
    </div>
  );
};

export default ScreenTop;
