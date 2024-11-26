import React from "react";
import Image from "next/image";
import Socials from "../socials";

const ScreenTop = () => {
  return (
    <div
      className='flex md:flex-row flex-col md:gap-0 gap-10 h-full w-full md:items-center items-start 
    bg-gradient-to-b from-transparent via-stone-400 to-transparent'
    >
      {/* // bg-gradient-to-b from-transparent via-stone-400 to-transparent */}
      <div className='flex flex-row h-full w-full md:w-2/4 justify-start md:px-5 px-5'>
        <div className='max-w-lg'>
          <div className='sub-heading font-russo'>
            <span className='font-ruthie heading'>Your Future</span>
            <br />
            Powered by Innovation
          </div>

          <div className='p-5'>
            AI is no longer a luxury—it`s a necessity. From predictive analytics
            to personalized customer experiences, we tailor solutions to fit
            your unique needs. Take the leap into the future and position your
            business as a leader in your industry.
          </div>
          <div className='quote'>
            &quot; Innovation distinguishes between a leader and a
            follower.&quot; - Steve Jobs
            <br />
            <br />
          </div>
          <div>Ready to lead? Let`s build your AI-driven future today.</div>
        </div>
      </div>
      <div className='flex flex-row justify-end h-full w-full md:w-2/4'>
        <Image
          className='rounded-lg'
          src='/sba-green.png'
          alt='SBA photo'
          width={500}
          height={500}
          priority
        />
      </div>
    </div>
  );
};

export default ScreenTop;
