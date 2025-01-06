import { blox_url } from "@/utils/endpoints/endpoints";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Icons from "../Icons";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";

export default function Portfolio() {
  const data = [
    {
      id: 1,
      url: "/portfolio/blox/1.png",
      alt: "Build Better Habits Faster",
    },
    {
      id: 2,
      url: "/portfolio/blox/2.png",
      alt: "Smart Goal Calculator",
    },
    {
      id: 3,
      url: "/portfolio/blox/3.png",
      alt: "Track and Win Your Week",
    },
    {
      id: 4,
      url: "/portfolio/blox/4.png",
      alt: "Start on Achievable Goals",
    },
    {
      id: 5,
      url: "/portfolio/blox/5.png",
      alt: "Manage Your Schedule",
    },
  ];
  const width = 150;
  const height = 150;
  return (
    <div className='w-full p-5 md:max-w-5xl max-w-sm'>
      <div className='flex flex-col gap-10'>
        <div>
          <div className='heading w-full text-center focus '>Portfolio</div>
          <div className='flex flex-row items-center justify-center sub-heading'>
            <Link
              href={blox_url}
              target='_blox'
              className='gap-3 icons text-slate-700'
            >
              Blox: Productivity hub
            </Link>
          </div>
        </div>
        {/* <div className='scrolling'> */}
        <Carousel
          orientation='horizontal'
          opts={{
            align: "center",
            loop: true,
          }}
        >
          <CarouselContent className='gap-2 ml-0'>
            {data.map((d) => (
              <CarouselItem
                key={d.id}
                className='md:basis-1/2 lg:basis-1/3 pl-4'
              >
                <Card className='w-72 min-w-72 min-h-80 h-80'>
                  <CardHeader className='shadow-sm p-3 bg-gradient-to-b from-indigo-50 to-transparent'>
                    <CardTitle className='font-semibold flex flex-row gap-2 items-center '>
                      <Icons.CircleCheckBig className='text-emerald-400 h-4 w-4 min-h-4 min-w-4' />
                      {d.alt}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='py-2 px-3 text-xs'>
                    <Image
                      key={d.id}
                      width={width}
                      height={height}
                      src={d.url}
                      className='shadow-xl rounded-md m-auto min-w-64 min-h-64'
                      alt={d.alt}
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        {/* </div> */}
      </div>
    </div>
  );
}
