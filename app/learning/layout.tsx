import type { Metadata } from "next";
import "../globals.css";
import Link from "next/link";
import Image from "next/image";
// import RootLayout from "../layout";
// import { AppSidebar } from "@/components/learning/sidebar";
// import {
//   // Sidebar,
//   // SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Learning",
  description: "Welcome to Syed's Learning website",
};
const data = [
  {
    id: 1,
    url: "/learning/Java",
    label: "Java",
    logo: "/logos/java.png",
  },
  {
    id: 2,
    url: "/learning/Python",
    label: "Python",
    logo: "/logos/python.jpeg",
  },
  {
    id: 3,
    url: "/learning/Computer Vision",
    label: "Computer Vision",
    logo: "/logos/cv2.png",
  },
  {
    id: 4,
    url: "/learning/Kafka",
    label: "Kafka",
    logo: "/logos/kafka.png",
  },
];

export default function LearningLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const width = 30;
  const height = 30;

  return (
    <div className='flex md:flex-row flex-col min-w-full min-h-screen max-w-screen'>
      {/* <SidebarProvider> */}
      {/* <AppSidebar /> */}
      <div
        className='md:w-1/5 w-full md:max-w-sm max-w-full bg-gradient-to-r from-transparent
       to-stone-100'
      >
        <div className='flex md:flex-col w-full  flex-row md:items-start items-center md:gap-0 gap-5 overflow-auto p-5 font-inter'>
          {data.map((d) => (
            <div
              key={d.id}
              className='flex flex-row md:gap-2 gap-1 p-3 items-center hover:text-orange-400'
            >
              <Image
                key={d.id}
                width={width}
                height={height}
                src={d.logo}
                className='object-scale-down drop-shadow-sm rounded-lg'
                alt={d.label}
              />
              <Link href={d.url} className='text-nowrap'>
                {d.label}
              </Link>
            </div>
          ))}
        </div>
        {/* <Sidebar variant='inset' className='relative'></Sidebar> */}
        {/* <AppSidebar /> */}
      </div>
      <div className='md:w-4/5 w-full'>
        {/* <SidebarTrigger /> */}
        {/* <SidebarInset> */}
        {/* <main> */}
        {children}
        {/* </main> */}
        {/* </SidebarInset> */}
      </div>
      {/* </SidebarProvider> */}
    </div>
  );
}
