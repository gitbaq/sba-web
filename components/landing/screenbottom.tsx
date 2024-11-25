import React from "react";
import Image from "next/image";

const ScreenBottom = () => {
  return (
    <div
      className='flex md:flex-row flex-col min-h-fit w-full md:items-center items-start 
    bg-gradient-to-b from-transparent via-stone-400 to-transparent 
    justify-between'
    >
      <div className='h-full w-fit content-center'>
        <Image
          className='rounded-lg'
          src='/left_portrait.png'
          alt='SBA Photo'
          width={445}
          height={500}
          priority
        />
        {/* <div className='font-ruthie text-8xl text-stone-800'>Syed Baqir</div> */}
      </div>
      <div className='flex flex-col h-full w-full md:w-2/4'>
        <div className='heading'>
          <span className='font-ruthie heading'>Your Business</span>
          <br />
          Redefined by AI
        </div>
        <div className='p-5 max-w-lg'>
          According to Gartner, the global AI software market is projected to
          reach $135 billion by 2025
          <br />
          With 70% of enterprises expected to adopt AI in some form by then.
          Companies already leveraging AI report up to 40% increases in
          productivity and 25% reductions in costs—the kind of results you don`t
          want to miss.
        </div>
        <div className='quote'>
          &quot; Innovation distinguishes between a leader and a follower.&quot;
        </div>
        <div>Ready to lead? Let`s build your AI-driven future today.</div>
      </div>
    </div>
  );
};

export default ScreenBottom;
