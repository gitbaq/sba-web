import type { Metadata } from "next";
import "../globals.css";
import Link from "next/link";
import { Topic } from "@/types/types";
import Icons from "@/components/Icons";
// import Image from "next/image";
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
// const data = [
//   {
//     id: 1,
//     url: "/learning/AWS",
//     label: "AWS",
//     logo: "/logos/aws.png",
//   },
//   // {
//   //   id: 2,
//   //   url: "/learning/Computer Vision",
//   //   label: "Computer Vision",
//   //   logo: "/logos/cv2.png",
//   // },
//   // {
//   //   id: 3,
//   //   url: "/learning/Java",
//   //   label: "Java",
//   //   logo: "/logos/java.png",
//   // },
//   // {
//   //   id: 4,
//   //   url: "/learning/Kafka",
//   //   label: "Kafka",
//   //   logo: "/logos/kafka.png",
//   // },
//   // {
//   //   id: 5,
//   //   url: "/learning/Python",
//   //   label: "Python",
//   //   logo: "/logos/python.jpeg",
//   // },
// ];

async function getAllTopics() {
  const res = await fetch(`http://localhost:8080/topics/v1`);
  return res.json();
}

export default async function LearningLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const width = 30;
  // const height = 30;
  const topicsData = getAllTopics();

  const [topics] = await Promise.all([topicsData]);
  return (
    <div className='flex md:flex-row flex-col min-w-full min-h-screen max-w-screen'>
      {/* <SidebarProvider> */}
      {/* <AppSidebar /> */}
      <div className='md:w-1/5 w-full md:max-w-sm max-w-full shadow-md'>
        <div className='flex md:flex-col w-full  flex-row md:items-start items-center md:gap-0 gap-5 overflow-auto p-5 font-inter'>
          <div className='flex flex-row py-2 gap-2 items-center text-slate-700 hover:text-slate-950'>
            <Icons.Rocket className='bg-slate-900 text-slate-400 rounded-md' />
            <Link href='/learning' className='sub-heading'>
              Learning
            </Link>
          </div>
          {topics.map((d: Topic) => (
            <div
              key={d.id}
              className='flex flex-row w-full rounded-sm px-5 items-center text-slate-700 hover:bg-slate-200'
            >
              <Link href={"/learning/" + d.id} className='text-nowrap'>
                {d.sbaTopicName}
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
