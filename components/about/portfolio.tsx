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
    <div className='flex flex-col gap-3 w-full justify-center'>
      <div className='p-2'>
        <div className='sub-heading w-full text-start'>Portfolio</div>
        <div className='flex flex-row items-center justify-start '>
          <Link
            href={blox_url}
            target='_blox'
            className='icons text-amber-500 dark:text-amber-400 font-semibold hover:underline underline-offset-8'
          >
            Blox: Productivity hub
          </Link>
        </div>
      </div>
      <div className='flex flex-row justify-center p-2 w-full'>
        <Carousel
          className='w-full '
          opts={{
            loop: true,
          }}
        >
          <CarouselContent className='gap-1'>
            {data.map((d) => (
              <CarouselItem key={d.id} className='md:basis-2/6 aspect-square'>
                <Card className='w-full'>
                  <CardHeader className='shadow-sm'>
                    <CardTitle>
                      <div className='font-semibold flex flex-row gap-2 items-center'>
                        <Icons.CircleCheckBig className='text-emerald-400 h-4 w-4 min-h-4 min-w-4' />
                        {d.alt}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='justify-center p-2 items-center'>
                    <Image
                      key={d.id}
                      src={d.url}
                      className='rounded-md aspect-square min-w-full min-h-full'
                      alt={d.alt}
                      width={width}
                      height={height}
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
