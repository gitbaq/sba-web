import HeroComponent from "@/components/home/herocomponent";
import ScreenTop from "@/components/home/screentop";
import Rightbar from "@/components/rightbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syed Baqir Ali - AI & Software Innovation Leader",
  description:
    "Expert in AI solutions, cloud integration, and software innovation. Transform your business with custom AI applications, DevOps automation, and modern cloud architecture.",
  keywords: [
    "AI solutions",
    "software innovation",
    "cloud integration",
    "DevOps",
    "custom AI applications",
  ],
};

export default function Home() {
  return (
    <div className='flex flex-row w-full h-full min-h-lvh gap-2'>
      <div className='flex flex-1 flex-col items-center justify-center w-full p-1 gap-5'>
        <header>
          <h1 className='sr-only'>
            Syed Baqir Ali - AI & Software Innovation Leader
          </h1>
        </header>
        <ScreenTop />
        <HeroComponent />
      </div>
      <div className='lg:flex hidden flex-col min-h-full w-64 min-w-64'>
        <Rightbar />
      </div>
    </div>
  );
}
