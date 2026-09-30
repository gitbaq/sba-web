import React from "react";
import Link from "next/link";
import Socials from "./socials";
import ThemeComponent from "./ThemeComponent";

const NAV = [
  { href: "/writing", label: "Writing" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/subscribe", label: "Subscribe" },
  { href: "/writing/series", label: "Series" },
  { href: "/contact", label: "Contact" },
  { href: "/feed.xml", label: "RSS", external: true },
] as const;

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className='border-t border-border/80 bg-background'>
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 md:flex-row md:items-start md:justify-between md:gap-10 md:py-12'>
        <div className='flex flex-col gap-2'>
          <Link
            href='/'
            className='font-display text-base font-semibold tracking-tight text-foreground hover:no-underline'
          >
            Syed <span className='text-muted-foreground'>Baqir Ali</span>
          </Link>
          <p className='max-w-xs text-sm text-muted-foreground leading-relaxed'>
            Practical notes on software, AI, and leading teams.
          </p>
          <p className='text-xs text-muted-foreground pt-1'>
            © {year} Syed Baqir Ali
          </p>
        </div>

        <nav aria-label='Footer' className='flex flex-col gap-3'>
          <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground'>
            Explore
          </p>
          <ul className='flex flex-wrap gap-x-4 gap-y-2 list-none m-0 p-0 md:max-w-sm'>
            {NAV.map((item) => (
              <li key={item.href}>
                {"external" in item && item.external ? (
                  <a
                    href={item.href}
                    className='text-sm text-muted-foreground transition-colors hover:text-brand'
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className='text-sm text-muted-foreground transition-colors hover:text-brand'
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className='flex flex-col gap-3'>
          <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground'>
            Connect
          </p>
          <Socials />
          <div className='pt-2'>
            <p className='mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground'>
              Theme
            </p>
            <ThemeComponent />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
