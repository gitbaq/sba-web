import HeroComponent from "@/components/home/herocomponent";
import ScreenTop from "@/components/home/screentop";

export default function Home() {
  return (
    <div className='flex flex-col items-center w-full h-full'>
      <ScreenTop />
      <HeroComponent />
    </div>
  );
}
