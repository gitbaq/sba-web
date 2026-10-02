"use client";

import dynamic from "next/dynamic";

const ThemeSelectorNoSSR = dynamic(() => import("./ThemeSelector"), {
  ssr: false,
});

export default function ThemeComponent({
  tone = "default",
}: {
  tone?: "default" | "footer";
}) {
  return <ThemeSelectorNoSSR tone={tone} />;
}
