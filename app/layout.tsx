import type { Metadata } from "next";
import type { Viewport } from "next";
import "./ui/globals.css";
import { inter } from "@/app/ui/fonts";
import Footer from "@/components/footer";
import { LearningSidebar } from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import Rightbar from "@/components/rightbar";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "Syed Baqir Ali - Innovate, Lead, Succeed",
  description: "Syed Baqir Ali - Innovate, Lead, Succeed",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: "dark",
  // Also supported but less commonly used
  // interactiveWidget: 'resizes-visual',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <script
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3600195581005817'
          crossOrigin='anonymous'
        ></script>
        <GoogleAnalytics gaId='G-8EVK1ZF0L8' />
      </head>
      <body
        className={`${inter.className} antialiased bg-stone-50 text-sm text-slate-950 w-full h-screen min-h-screen max-w-full`}
      >
        <TooltipProvider delayDuration={2000}>
          <SidebarProvider defaultOpen={true} className='h-full w-full'>
            <div className='flex flex-col w-full h-fit min-h-full'>
              <Navbar />
              <div className='flex flex-row w-full min-h-full h-full  '>
                <LearningSidebar />
                <main className='flex flex-row w-full h-full items-start justify-center'>
                  <div className='lg:max-w-4xl md:max-w-lg w-full h-full'>
                    {children}
                  </div>
                </main>
                <div className='lg:flex hidden flex-col min-h-full w-64 min-w-64'>
                  <Rightbar />
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
