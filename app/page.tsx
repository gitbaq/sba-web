import HeroComponent from "@/components/home/herocomponent";
import ScreenTop from "@/components/home/screentop";
import Rightbar from "@/components/rightbar";

export default function Home() {
  return (
    <div className='flex flex-row w-full h-full min-h-lvh gap-2'>
      <div className='flex flex-col items-center w-full h-full min-h-full'>
        <ScreenTop />
        <HeroComponent />
        &nbsp;
      </div>
      <div className='lg:flex hidden flex-col min-h-full w-64 min-w-64'>
        <Rightbar />
      </div>
    </div>
  );
}
