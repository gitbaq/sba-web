import Socials from "@/components/socials";
import React from "react";
import Image from "next/image";

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
    <div className='content'>
      <div className='flex md:flex-row flex-col'>
        <div className='flex flex-col p-10 lg:items-end items-center justify-center md:w-1/2 w-full'>
          <div className='max-w-sm'>
            <span className='font-semibold'>
              In case we haven’t crossed paths yet
            </span>
            <br />
            I’m Baqir Syed - Software Solutions and AI Leader.
            <br />
            Through my work and insights, I help individuals and teams harness
            technology, streamline processes, and build projects that truly make
            an impact.
            <div className=' py-10'>
              Let’s turn your vision into measurable success.
              <div className='flex flex-row gap-3'>
                <Socials />
              </div>
            </div>
          </div>
        </div>
        <div className='md:w-1/2 w-full flex justify-center p-10 '>
          <Image
            className='rounded-full bg-gradient-to-b from-neutral-800 via-neutral-400 to-inherit'
            src='/sba-portrait_right.png'
            alt='SBA photo'
            width={320}
            height={320}
            priority
          />
        </div>
      </div>
    </div>
    // <Card className='w-[350px] max-w-100 m-5'>
    //   <CardHeader>
    //     <CardTitle>My Projects</CardTitle>
    //     <CardDescription>Blox: Productivity Hub</CardDescription>
    //   </CardHeader>
    //   <CardContent>Project 1</CardContent>
    //   <CardFooter className='flex justify-between'>
    //     <Button variant='outline'>Cancel</Button>
    //     <Button>Deploy</Button>
    //   </CardFooter>
    // </Card>
  );
}
