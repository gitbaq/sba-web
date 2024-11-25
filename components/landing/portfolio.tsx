import Image from "next/image";
import Link from "next/link";
import React from "react";
import Icons from "../Icons";

export default function Portfolio() {
  const data = [
    {
      id: 1,
      url: "/portfolio/blox/1.png",
      alt: "Blox Intro",
    },
    {
      id: 2,
      url: "/portfolio/blox/2.png",
      alt: "Blox Intro",
    },
    {
      id: 3,
      url: "/portfolio/blox/4.png",
      alt: "Blox Intro",
    },
    {
      id: 4,
      url: "/portfolio/blox/5.png",
      alt: "Blox Intro",
    },
    {
      id: 5,
      url: "/portfolio/blox/5.png",
      alt: "Blox Intro",
    },
    {
      id: 6,
      url: "/portfolio/blox/5.png",
      alt: "Blox Intro",
    },
  ];
  const width = 300;
  const height = 300;
  return (
    <div className='flex flex-col'>
      <div className='heading w-full text-center font-russo'>
        Visit my portfolio
      </div>
      <div className='flex flex-row items-center ml-5'>
        <Icons.ChevronRight />
        <Link
          href='https://blox.syedbaqirali.com'
          target='_blox'
          className='gap-3 icons'
        >
          Blox: Productivity hub
        </Link>
      </div>
      <div className='flex flex-row justify-around md:gap-3 gap-2 md:p-5 w-full bg-gradient-to-b from-transparent via-red-700 to-transparent overflow-auto'>
        {data.map((d) => (
          <Image
            key={d.id}
            width={width}
            height={height}
            src={d.url}
            className='object-scale-down drop-shadow-md rounded-lg m-auto'
            alt={d.alt}
          />
        ))}
      </div>
    </div>
  );
}
