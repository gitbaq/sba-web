"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: 0 | 1 | 2;
  as?: "div" | "section" | "li" | "header";
  /** Show on mount without waiting for scroll (hero / above-the-fold). */
  immediate?: boolean;
};

/** Subtle enter-on-view motion — no-op when reduced motion. */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  immediate = false,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || immediate) {
      // rAF so the CSS transition still runs from opacity 0 → 1
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px 12% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [immediate]);

  const delayClass =
    delay === 1 ? "reveal-delay-1" : delay === 2 ? "reveal-delay-2" : "";

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${visible ? "is-visible" : ""} ${delayClass} ${className}`}
    >
      {children}
    </Tag>
  );
}
