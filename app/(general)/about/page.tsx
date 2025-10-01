import React from "react";
import Image from "next/image";
import Socials from "@/components/socials";
import Portfolio from "@/components/about/portfolio";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Syed Baqir Ali - AI & Software Innovation Expert",
  description:
    "Learn about Syed Baqir Ali's expertise in AI solutions, software innovation, and technology leadership. Discover how I help teams build impactful projects.",
};

export default function About() {
  return (
    <div className='flex flex-col gap-5 h-full items-center p-3'>
      <div className='flex lg:flex-row flex-col-reverse max-w-7xl justify-center items-center'>
        <div className='rounded-ss-full bg-gradient-to-b bg-amber-500 w-full aspect-square flex items-center justify-center'>
          <Image
            className=' from-neutral-800 via-neutral-400 to-inherit rounded-full'
            src='/sba-photo-2-small.png'
            alt='Syed Baqir Ali - AI Leadership.'
            width={320}
            height={320}
            priority
          />
        </div>

        <div className='flex flex-col w-full md:w-7xl justify-start gap-5 items-start p-5'>
          <header className='flex flex-col sub-heading items-start'>
            <h1 className=' w-full text-4xl'>Syed Baqir Ali</h1>
            <h2 className='text-xl'>Software Innovation and AI Leader</h2>
          </header>

          <p className='max-w-sm'>
            Through my work and insights, I help individuals and teams harness
            technology, streamline processes, and build projects that truly make
            an impact
          </p>
          <div className='flex flex-col items-center justify-center gap-5'>
            <p>Let&apos;s turn your vision into measurable success.</p>
            <div className='flex flex-row w-full bg-accent items-center justify-center gap-3 p-3 rounded-lg'>
              <Socials />
            </div>
          </div>
        </div>
      </div>
      <section className='max-w-full w-full p-10 bg-accent rounded-2xl'>
        <h2 className='text-2xl font-bold mb-5'>Portfolio</h2>
        <Portfolio />
      </section>
    </div>
  );
}
