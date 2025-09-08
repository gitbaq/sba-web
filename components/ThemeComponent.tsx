import dynamic from 'next/dynamic';
import React from 'react'

const ThemeComponent = () => {
    const ThemeSelectorNoSSR = dynamic(() => import("./ThemeSelector"), {
        ssr: false,
      });
  return <ThemeSelectorNoSSR />;
}

export default ThemeComponent