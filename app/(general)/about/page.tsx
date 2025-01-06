// import Socials from "@/components/socials";
import React from "react";
import Image from "next/image";
import Socials from "@/components/socials";
import Portfolio from "@/components/landing/portfolio";

export default function About() {
  return (
    <div className='flex flex-col w-full h-full min-h-full items-center justify-center gap-10 py-5'>
      <div
        className='flex md:flex-row flex-col md:gap-10 gap-10 md:items-center items-center
       p-5 '
      >
        <div className='rounded-ss-full bg-gradient-to-b bg-amber-400'>
          <Image
            className=' from-neutral-800 via-neutral-400 to-inherit'
            src='/sba-right.png'
            alt='Syed Baqir Ali - AI Leadership'
            width={320}
            height={320}
            priority
          />
        </div>

        <div className='flex flex-col h-full w-full md:w-2/4 justify-center p-3 gap-5'>
          <div className='flex flex-col sub-heading items-center justify-center'>
            <div className='focus'>Syed Baqir</div>
            <div>Software Innovation and AI Leader</div>
          </div>

          <div className='px-3 max-w-sm'>
            Through my work and insights, I help individuals and teams harness
            technology, streamline processes, and build projects that truly make
            an impact.
          </div>
          <div className='flex flex-col items-center justify-center'>
            Let’s turn your vision into measurable success.
            <div className='flex flex-row items-center justify-center gap-3 p-3'>
              <Socials />
            </div>
          </div>
        </div>
      </div>
      <Portfolio />
    </div>
  );
}
