import HeroComponent from "@/components/heroes/herocomponent";
import ScreenTop from "@/components/landing/screentop";

export default function Home() {
  return (
    <section className='w-full mx-5 h-full'>
      <div className='flex flex-col items-center'>
        <ScreenTop />
        <HeroComponent />
      </div>
    </section>
  );
}
