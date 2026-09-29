import React from "react";
import Icons from "./Icons";
import { LINKEDIN_URL } from "@/lib/audience";

const LINKS = [
  {
    href: LINKEDIN_URL,
    label: "LinkedIn",
    Icon: Icons.FaLinkedin,
  },
  {
    href: "https://www.twitter.com/baq2coaching",
    label: "X (Twitter)",
    Icon: Icons.FaXTwitter,
  },
  {
    href: "https://calendly.com/syedbaqirali/30min",
    label: "Book a call on Calendly",
    Icon: Icons.FaCalendarDays,
  },
  {
    href: "https://linktr.ee/syedbaqirali",
    label: "Linktree",
    Icon: Icons.PiLinktreeLogo,
  },
] as const;

const Socials = () => {
  return (
    <ul className='flex flex-row items-center gap-1 list-none m-0 p-0'>
      {LINKS.map(({ href, label, Icon }) => (
        <li key={href}>
          <a
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={label}
            className='inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-brand hover:bg-brand-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          >
            <Icon className='h-[1.125rem] w-[1.125rem]' aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Socials;
