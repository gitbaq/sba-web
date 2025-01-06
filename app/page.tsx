import HeroComponent from "@/components/heroes/herocomponent";
import ScreenTop from "@/components/landing/screentop";

export default function Home() {
  return (
    <section className='flex flex-col md:items-center w-full'>
      <ScreenTop />
      <HeroComponent />
    </section>
  );
}
