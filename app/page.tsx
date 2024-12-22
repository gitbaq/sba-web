// import Footer from "@/components/footer";
// import ImageCarousel from "@/components/landing/image-carousel";
// import Portfolio from "@/components/landing/portfolio";
// import ScreenIntro from "@/components/landing/screenIntro";
// import ScreenBottom from "@/components/landing/screenbottom";
// import ScreenMid from "@/components/landing/screenmid";
import ScreenMid from "@/components/landing/screenmid";
import ScreenTop from "@/components/landing/screentop";

export default function Home() {
  return (
    <div
      className='flex flex-col w-full items-center justify-center gap-10
    bg-gradient-to-b from-transparent via-stone-200 to-transparent'
    >
      {/* <main className='flex flex-col w-full sm:items-start'> */}
      <ScreenTop />
      {/* <ImageCarousel />

      <div className="bg-[url('/wordcloud.png')] w-full">
        <div className='bg-teal-200 bg-opacity-90 w-full'>
          <ScreenIntro />
          <ScreenMid />
        </div>
      </div>
      <ScreenBottom />
      <Portfolio /> */}

      {/* </main> */}
      {/* <Footer /> */}
      <div className='w-full'>
        <ScreenMid />
      </div>
    </div>
  );
}
