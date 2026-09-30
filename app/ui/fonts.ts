import { Outfit, Source_Sans_3, Source_Serif_4 } from "next/font/google";

/** Modern display / brand - nav wordmark, heroes, section titles */
export const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

/** UI / interface - body chrome, controls, labels */
export const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/** Long-form reading - articles, quotes */
export const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-article",
  display: "swap",
});

/** @deprecated use `outfit` - kept for any lingering imports */
export const newsreader = outfit;
