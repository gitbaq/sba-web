import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { GoogleAnalytics } from "@next/third-parties/google";

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
      <body className='flex flex-col bg-slate-100 gap-5 '>
        <Navbar />

        <div className='flex flex-col min-h-screen max-w-screen overflow-clip'>
          {children}
        </div>

        <Footer />
      </body>
      <GoogleAnalytics gaId='G-8EVK1ZF0L8' />
    </html>
  );
}
