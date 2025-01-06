import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/footer";
import { LearningSidebar } from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import Rightbar from "@/components/rightbar";
import { Toaster } from "@/components/ui/sonner";
import Icons from "@/components/Icons";
import Quote from "@/components/quote";
// import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "Syed Baqir Ali - Innovate, Lead, Succeed",
  description: "Syed Baqir Ali - Innovate, Lead, Succeed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        {/* <script
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3600195581005817'
          crossOrigin='anonymous'
        ></script> */}
        {/* <GoogleAnalytics gaId='G-8EVK1ZF0L8' /> */}
      </head>
      <body className='bg-stone-50 text-sm text-slate-950 w-full h-screen min-h-screen'>
        <TooltipProvider>
          <SidebarProvider defaultOpen={true} className='min-h-screen w-full'>
            <div className='flex flex-col w-full h-full min-h-full'>
              <Navbar />
              <div className='flex flex-row w-full min-h-full h-full  '>
                <LearningSidebar />

                <main className='flex flex-col w-full h-full min-h-screen items-center bg-gradient-to-t from-slate-100 to-transparent'>
                  {children}
                </main>
                <div className='w-64 min-w-64 lg:flex hidden side-panels p-2 flex-col bg-red-100'>
                  <Rightbar />
                  <Quote />
                </div>
                <div className='lg:hidden flex side-panels p-1'>
                  <Icons.Menu />
                </div>
              </div>
              <Footer />
            </div>
          </SidebarProvider>
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
