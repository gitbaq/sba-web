import type { Metadata } from "next";
import type { Viewport } from "next";
import "./ui/globals.css";
import { outfit, sourceSans, sourceSerif } from "@/app/ui/fonts";
import Footer from "@/components/footer";
import SkipLink from "@/components/SkipLink";
import JsonLd from "@/components/JsonLd";
import { SITE, personJsonLd, websiteJsonLd } from "@/lib/seo";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@wrksz/themes/next";
import Script from "next/script";
import SidebarWrapper from "@/components/SidebarWrapper";
import { AuthProvider } from "@/utils/AuthContext";
import RefreshOnBack from "@/components/RefreshOnBack";

const gsc = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: "%s | Syed Baqir Ali",
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: [SITE.ogImage],
    creator: SITE.twitter,
  },
  alternates: {
    types: {
      "application/rss+xml": [
        { url: `${SITE.url}/feed.xml`, title: "Writing RSS" },
      ],
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  ...(gsc ? { verification: { google: gsc } } : {}),
};

/** WCAG: allow pinch-zoom; support light + dark color schemes */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${sourceSans.variable} ${outfit.variable} ${sourceSerif.variable}`}
    >
      <body className='font-sans antialiased w-full min-h-lvh flex flex-col'>
        <JsonLd id='site-json-ld' data={[personJsonLd(), websiteJsonLd()]} />
        <Script
          id='adsense'
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3600195581005817'
          crossOrigin='anonymous'
          strategy='afterInteractive'
        />
        <GoogleAnalytics gaId='G-8EVK1ZF0L8' />
        <SkipLink />
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange={false}
          storage='localStorage'
        >
          <AuthProvider>
            <RefreshOnBack />
            <TooltipProvider delayDuration={1000}>
              <div className='flex-1'>
                <SidebarWrapper>
                  {children}

                  <Toaster position='top-right' />
                  <Analytics />
                  <SpeedInsights />
                </SidebarWrapper>
              </div>
              <Footer />
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
