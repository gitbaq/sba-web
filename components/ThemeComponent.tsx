"use client";

import dynamic from "next/dynamic";

const ThemeSelectorNoSSR = dynamic(() => import("./ThemeSelector"), {
  ssr: false,
});

export default function ThemeComponent() {
  return <ThemeSelectorNoSSR />;
}
