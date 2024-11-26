// import Footer from "@/components/footer";
import ImageCarousel from "@/components/landing/image-carousel";
import Portfolio from "@/components/landing/portfolio";
import ScreenIntro from "@/components/landing/screenIntro";
import ScreenBottom from "@/components/landing/screenbottom";
import ScreenMid from "@/components/landing/screenmid";
import ScreenTop from "@/components/landing/screentop";

export default function Home() {
  return (
    <div className='flex flex-col w-full items-center justify-items-center overflow-y-clip gap-10'>
      {/* <main className='flex flex-col w-full sm:items-start'> */}
      <ScreenTop />
      <ImageCarousel />

      <div className="bg-[url('/wordcloud.png')] w-full">
        <div className='bg-teal-200 bg-opacity-90 w-full'>
          <ScreenIntro />
          <ScreenMid />
        </div>
      </div>
      <ScreenBottom />
      <Portfolio />

      {/* </main> */}
      {/* <Footer /> */}
    </div>
  );
}
