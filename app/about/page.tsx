// import Socials from "@/components/socials";
import React from "react";
import Image from "next/image";
import Socials from "@/components/socials";
import Portfolio from "@/components/landing/portfolio";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   // CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

export default function CardWithForm() {
  return (
    <div
      className='flex flex-col w-full items-center justify-center gap-10
    bg-gradient-to-b from-transparent via-stone-200 to-transparent'
    >
      <div
        className='flex md:flex-row flex-col md:gap-10 gap-10 md:items-center items-center
       p-5 h-full'
      >
        <div className='rounded-ss-full bg-gradient-to-b bg-sky-200 p-3'>
          <Image
            className=' from-neutral-800 via-neutral-400 to-inherit'
            src='/sba-right.png'
            alt='SBA'
            width={320}
            height={320}
            priority
          />
        </div>
        {/* <div className='flex flex-row justify-center md:w-2/4 p-5'>
           <Image
             className='rounded-full bg-gradient-to-b from-neutral-800 via-neutral-400 to-inherit'
             src='/ai4.png'
             alt='AI'
             width={320}
             height={320}
             priority
           />
         </div> */}
        <div className='flex flex-col h-full w-full md:w-2/4 justify-center p-3 gap-3'>
          <div className='flex flex-col sub-heading gap-5'>
            <div className='heading md:text-6xl text-nowrap'>Baqir Syed</div>
            <div className='px-3'>Software Innovation and AI Leader</div>
          </div>

          <div className='px-3 max-w-sm'>
            Through my work and insights, I help individuals and teams harness
            technology, streamline processes, and build projects that truly make
            an impact.
          </div>
          <div className=' py-10'>
            Let’s turn your vision into measurable success.
            <div className='flex flex-row gap-3'>
              <Socials />
            </div>
          </div>
        </div>
      </div>
      <div className='w-full'>
        <Portfolio />
      </div>
    </div>
  );
}
