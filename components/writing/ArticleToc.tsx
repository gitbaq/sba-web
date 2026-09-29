import Link from "next/link";
import { TocItem } from "@/lib/articles";

export default function ArticleToc({ items }: { items: TocItem[] }) {
  if (items.length < 2) return null;

  return (
    <nav
      aria-labelledby='toc-heading'
      className='rounded-lg border border-border bg-secondary/40 p-4 mb-10'
    >
      <h2 id='toc-heading' className='text-sm font-semibold uppercase tracking-wide mb-3'>
        On this page
      </h2>
      <ol className='flex flex-col gap-1.5 list-none p-0 m-0 text-sm'>
        {items.map((item) => (
          <li
            key={item.id}
            className={item.level === 1 ? "" : item.level === 2 ? "pl-3" : "pl-6"}
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
