import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const links = [
  {
    href: "/admin/series",
    title: "Series",
    text: "Add, rename, and publish series.",
  },
  {
    href: "/writing",
    title: "Writing library",
    text: "Open an essay, then use /editor/[id] to edit.",
  },
];

export default function AdminHome() {
  return (
    <main className='mx-auto w-full max-w-3xl px-4 py-10 md:py-14'>
      <header className='mb-10'>
        <p className='accent-label mb-2'>Ops</p>
        <h1 className='display-title text-3xl md:text-4xl'>Admin</h1>
        <p className='mt-2 text-muted-foreground max-w-xl'>
          Content and layout tools. Auth required. No paid third-party editor
          cloud.
        </p>
      </header>
      <ul className='m-0 grid list-none gap-4 p-0'>
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className='block rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand/40 hover:no-underline'
            >
              <span className='font-display text-lg font-semibold text-foreground'>
                {l.title}
              </span>
              <span className='mt-1 block text-sm text-muted-foreground'>
                {l.text}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
