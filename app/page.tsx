import HeroComponent from "@/components/home/herocomponent";
import ScreenTop from "@/components/home/screentop";
import Rightbar from "@/components/rightbar";

export default function Home() {
  return (
    <div className='flex flex-row w-full h-full min-h-lvh gap-2'>
      <div className='flex flex-1 flex-col items-center justify-center w-full p-1 gap-5'>
        <ScreenTop />
        <HeroComponent />
      </div>
      <div className='lg:flex hidden flex-col min-h-full w-64 min-w-64'>
        <Rightbar />
      </div>
    </div>
  );
}
