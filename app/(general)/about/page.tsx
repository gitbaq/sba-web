// import Socials from "@/components/socials";
import React from "react";
import Image from "next/image";
import Socials from "@/components/socials";
import Portfolio from "@/components/about/portfolio";

export default function About() {
  return (
    <div className='flex flex-col gap-5 h-full items-center p-3'>
      <div className='flex lg:flex-row flex-col-reverse max-w-7xl justify-center items-center'>
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

        <div className='flex flex-col w-full md:w-7xl justify-start gap-5 items-start p-5'>
          <div className='flex flex-col sub-heading items-start'>
            <div className=' w-full text-4xl'>Syed Baqir Ali</div>
            <div>Software Innovation and AI Leader</div>
          </div>

          <div className='max-w-sm'>
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
      <div className='max-w-full w-full p-10 bg-accent rounded-2xl'>
        <Portfolio />
      </div>
    </div>
  );
}
