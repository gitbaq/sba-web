import Image from "next/image";
import React from "react";

export default function ImageCarousel() {
  const data = [
    {
      id: 1,
      url: "/ai1.png",
      alt: "AI 1",
    },
    {
      id: 2,
      url: "/ai2.png",
      alt: "AI 2",
    },
    {
      id: 3,
      url: "/ai3.png",
      alt: "AI 3",
    },
    {
      id: 4,
      url: "/ai4.png",
      alt: "AI 4",
    },
  ];
  const width = 250;
  const height = 250;
  return (
    // md:gap-3 gap-2 md:p-5 p-5
    <div
      className='flex flex-row md:justify-around justify-center gap-10
    w-full bg-gradient-to-b from-transparent via-red-700 to-transparent 
    overflow-scroll'
    >
      {data.map((d) => (
        <Image
          key={d.id}
          width={width}
          height={height}
          src={d.url}
          className='object-scale-down drop-shadow-sm rounded-lg'
          alt={d.alt}
        />
      ))}
    </div>
  );
}
