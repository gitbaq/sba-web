// import Socials from "@/components/socials";
import React from "react";
import Image from "next/image";
import Socials from "@/components/socials";
import Portfolio from "@/components/about/portfolio";

export default function About() {
  return (
    <div className='flex flex-col gap-5 w-full h-full items-center p-3'>
      <div className='flex h-full w-full lg:flex-row flex-col justify-center lg:items-center items-center'>
        <div className='rounded-ss-full bg-gradient-to-b bg-amber-400'>
          <Image
            className=' from-neutral-800 via-neutral-400 to-inherit'
            src='/sba-right.png'
            alt='Syed Baqir Ali - AI Leadership.'
            width={320}
            height={320}
            priority
          />
        </div>

        <div className='flex flex-col h-full min-h-full w-full md:w-2/4 justify-center p-3 gap-5 items-center'>
          <div className='flex flex-col sub-heading items-center'>
            <div className='heading w-full'>Syed Baqir</div>
            <div>Software Innovation and AI Leader</div>
          </div>

          <div className='px-3 max-w-sm'>
            Through my work and insights, I help individuals and teams harness
            technology, streamline processes, and build projects that truly make
            an impact
          </div>
          <div className='flex flex-col items-center justify-center gap-5'>
            Let’s turn your vision into measurable success.
            <div className='flex flex-row w-full bg-accent items-center justify-center gap-3 p-3 rounded-lg'>
              <Socials />
            </div>
          </div>
        </div>
      </div>
      <div className='max-w-full w-full z-50'>
        <Portfolio />
      </div>
    </div>
  );
}
