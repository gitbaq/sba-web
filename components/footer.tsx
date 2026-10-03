import React from "react";
import Link from "next/link";
import Socials from "./socials";
import ThemeComponent from "./ThemeComponent";
import LoginLink from "./LoginLink";
import { FOOTER_NAV, FOOTER_PROJECTS } from "@/lib/siteShell";
import { SITE } from "@/lib/seo";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className='site-footer'>
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 md:flex-row md:items-start md:justify-between md:gap-10 md:py-12'>
        <div className='flex flex-col gap-2'>
          <Link
            href='/'
            className='footer-brand font-display text-base font-semibold tracking-tight hover:no-underline'
          >
            Syed <span>Baqir Ali</span>
          </Link>
          <p className='footer-muted max-w-xs text-sm leading-relaxed'>
            {SITE.tagline}
          </p>
          <p className='footer-muted pt-1 text-xs'>
            © {year} Syed Baqir Ali
          </p>
        </div>

        <nav aria-label='Footer' className='flex flex-col gap-3'>
          <p className='footer-heading text-[11px] font-semibold uppercase tracking-[0.14em]'>
            Explore
          </p>
          <ul className='m-0 flex list-none flex-col gap-2 p-0'>
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                {"external" in item && item.external ? (
                  <a href={item.href} className='footer-link footer-muted text-sm'>
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href} className='footer-link footer-muted text-sm'>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <LoginLink className='footer-link footer-muted text-sm opacity-80' />
            </li>
          </ul>
        </nav>

        <nav aria-label='Projects' className='flex flex-col gap-3'>
          <p className='footer-heading text-[11px] font-semibold uppercase tracking-[0.14em]'>
            Projects
          </p>
          <ul className='m-0 flex list-none flex-col gap-2 p-0'>
            {FOOTER_PROJECTS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='footer-link footer-muted text-sm'
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className='flex flex-col gap-3'>
          <p className='footer-heading text-[11px] font-semibold uppercase tracking-[0.14em]'>
            Connect
          </p>
          <Socials />
          <div className='pt-2'>
            <p className='footer-heading mb-2 text-[11px] font-semibold uppercase tracking-[0.14em]'>
              Theme
            </p>
            <ThemeComponent tone='footer' />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
