"use client";

import { useState } from "react";
import { TocItem } from "@/lib/articles";

export default function ArticleToc({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);
  if (items.length < 2) return null;

  return (
    <nav
      aria-labelledby='toc-heading'
      className='mb-5 rounded-lg border border-border bg-secondary/40'
    >
      <div className='flex items-center justify-between gap-3 p-4 md:pb-2'>
        <h2
          id='toc-heading'
          className='text-sm font-semibold uppercase tracking-wide'
        >
          On this page
        </h2>
        <button
          type='button'
          className='text-sm font-medium text-brand underline-offset-4 hover:underline md:hidden min-h-11 px-2'
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Hide" : "Show"}
        </button>
      </div>
      <ol
        className={[
          "flex flex-col gap-1.5 list-none p-0 m-0 text-sm px-4 pb-4",
          open ? "flex" : "hidden md:flex",
        ].join(" ")}
      >
        {items.map((item) => (
          <li
            key={item.id}
            className={
              item.level === 1 ? "" : item.level === 2 ? "pl-3" : "pl-6"
            }
          >
            <a
              href={`#${item.id}`}
              className='text-muted-foreground hover:text-brand underline-offset-2 hover:underline'
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
