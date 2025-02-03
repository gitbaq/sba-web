import HeroComponent from "@/components/home/herocomponent";
import ScreenTop from "@/components/home/screentop";

export default function Home() {
  return (
    <section className='flex flex-col items-center w-full px-3 h-full'>
      <ScreenTop />
      <HeroComponent />
    </section>
  );
}
