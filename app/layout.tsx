import type { Metadata } from "next";
import type { Viewport } from "next";
import "./ui/globals.css";
import { inter } from "@/app/ui/fonts";
import Footer from "@/components/footer";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";
import SidebarWrapper from "@/components/SidebarWrapper";
import { AuthProvider } from "@/utils/AuthContext";
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
        className={`${inter.className} antialiased w-full min-h-lvh flex flex-col`}
      >
        <AuthProvider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <TooltipProvider delayDuration={1000}>
              <div className='flex-1'>
                <SidebarWrapper>
                  {children}

                  <Toaster />
                  <Analytics />
                  <SpeedInsights />
                </SidebarWrapper>
              </div>
              <Footer />
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
