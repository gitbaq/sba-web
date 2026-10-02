"use client";

import { useState } from "react";
import { TocItem } from "@/lib/articles";

export default function ArticleToc({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);
  if (items.length < 2) return null;

  return (
    <nav
      aria-labelledby='toc-heading'
      className='mb-5 rounded-lg border border-border bg-background shadow-sm'
    >
      <button
        type='button'
        className='flex w-full min-h-11 items-center justify-between gap-3 px-4 py-3 text-left'
        aria-expanded={open}
        aria-controls='article-toc-list'
        onClick={() => setOpen((v) => !v)}
      >
        <h2
          id='toc-heading'
          className='text-sm font-semibold uppercase tracking-wide'
        >
          On this page
        </h2>
        <span className='text-sm font-medium text-brand underline-offset-4'>
          {open ? "Hide" : "Show"}
        </span>
      </button>
      <ol
        id='article-toc-list'
        hidden={!open}
        className='m-0 flex list-none flex-col gap-1.5 border-t border-border px-4 py-3 text-sm'
      >
        {items.map((item) => (
          <li
            key={item.id}
            className={
              item.level <= 2
                ? ""
                : item.level === 3
                  ? "pl-3"
                  : "pl-6"
            }
          >
            <a
              href={`#${item.id}`}
              className='text-muted-foreground hover:text-brand underline-offset-2 hover:underline'
              onClick={() => setOpen(false)}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
