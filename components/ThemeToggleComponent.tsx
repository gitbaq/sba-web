"use client";

import dynamic from "next/dynamic";

const ThemeToggleNoSSR = dynamic(() => import("./ThemeToggle"), {
  ssr: false,
});

export default function ThemeToggleComponent() {
  return <ThemeToggleNoSSR />;
}
