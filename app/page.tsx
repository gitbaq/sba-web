import HeroComponent from "@/components/heroes/herocomponent";
import ScreenTop from "@/components/landing/screentop";

export default function Home() {
  return (
    <section className='flex flex-col items-center w-full px-5 h-full'>
      <ScreenTop />
      <HeroComponent />
    </section>
  );
}
