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
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";
export const metadata: Metadata = {
  title: "Syed B - Innovate, Lead, Succeed",
  description: "Syed B - Innovate, Lead, Succeed",
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
    <html lang='en' suppressHydrationWarning>
      <head>
        <script
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3600195581005817'
          crossOrigin='anonymous'
        ></script>
        <GoogleAnalytics gaId='G-8EVK1ZF0L8' />
      </head>
      <body
        className={`${inter.className} antialiased text-sm w-full h-fit min-h-screen max-w-full`}
      >
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <TooltipProvider delayDuration={2000}>
            <SidebarProvider defaultOpen={false} className='h-full w-full'>
              <div className='flex flex-col w-full h-full min-h-full'>
                <Navbar />
                <div className='flex flex-row w-full min-h-full h-full'>
                  <LearningSidebar />
                  <main className='flex flex-row w-full h-full items-start justify-center'>
                    <div className='lg:max-w-4xl md:max-w-lg w-full h-full'>
                      {children}
                    </div>
                  </main>
                  <div className='md:flex hidden flex-col min-h-full w-64 min-w-64'>
                    <Rightbar />
                  </div>
                </div>
                <Footer />
              </div>
            </SidebarProvider>
          </TooltipProvider>
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
