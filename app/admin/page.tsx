import Link from "next/link";
import { Metadata } from "next";
import { ADMIN_NAV_SECTIONS, ADMIN_OVERVIEW_LINK } from "@/lib/adminNav";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminHome() {
  return (
    <main className='mx-auto w-full max-w-3xl px-4 py-10 md:py-14'>
      <header className='mb-10'>
        <p className='accent-label mb-2'>Ops</p>
        <h1 className='display-title text-3xl md:text-4xl'>Admin</h1>
        <p className='mt-2 text-muted-foreground max-w-xl'>
          {ADMIN_OVERVIEW_LINK.description}. Tools are grouped by site content,
          writing, and audience.
        </p>
      </header>
      <div className='flex flex-col gap-10'>
        {ADMIN_NAV_SECTIONS.map((section) => (
          <section key={section.id} aria-labelledby={`admin-${section.id}`}>
            <h2
              id={`admin-${section.id}`}
              className='font-display text-xl font-semibold mb-4'
            >
              {section.label}
            </h2>
            <ul className='m-0 grid list-none gap-4 p-0'>
              {section.links.map((l) => (
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
          </section>
        ))}
      </div>
    </main>
  );
}
