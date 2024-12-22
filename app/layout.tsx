import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Innovate. Lead. Succeed.",
  description: "Welcome to Syed's website",
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
        <GoogleAnalytics gaId='G-8EVK1ZF0L8' />
      </head>
      <body className='flex flex-col bg-slate-100 font-thin'>
        <TooltipProvider>
          <Navbar />
        </TooltipProvider>
        <div className='flex flex-col min-h-screen max-w-screen overflow-clip'>
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}
