import Link from "next/link";
import { Metadata } from "next";
import { ADMIN_MANAGE_LINKS } from "@/lib/adminNav";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminHome() {
  const tools = ADMIN_MANAGE_LINKS.filter((l) => l.href !== "/admin");

  return (
    <main className='mx-auto w-full max-w-3xl px-4 py-10 md:py-14'>
      <header className='mb-10'>
        <p className='accent-label mb-2'>Ops</p>
        <h1 className='display-title text-3xl md:text-4xl'>Admin</h1>
        <p className='mt-2 text-muted-foreground max-w-xl'>
          Manage essays, series, and newsletter sends. Use the Manage menu in
          the top nav or the left sidebar to move between tools.
        </p>
      </header>
      <ul className='m-0 grid list-none gap-4 p-0'>
        {tools.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className='block rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand/40 hover:no-underline'
            >
              <span className='font-display text-lg font-semibold text-foreground'>
                {l.menuLabel}
              </span>
              <span className='mt-1 block text-sm text-muted-foreground'>
                {l.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
