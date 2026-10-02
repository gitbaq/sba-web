import React from "react";
import Icons from "./Icons";
import { SITE } from "@/lib/seo";

const LINKS = [
  {
    href: SITE.linkedin,
    label: "LinkedIn profile",
    Icon: Icons.FaLinkedin,
  },
  {
    href: SITE.x,
    label: "X profile",
    Icon: Icons.FaXTwitter,
  },
  {
    href: SITE.calendly,
    label: "Book a call on Calendly",
    Icon: Icons.FaCalendarDays,
  },
] as const;

const Socials = () => {
  return (
    <ul className='m-0 flex list-none flex-row items-center gap-1 p-0'>
      {LINKS.map(({ href, label, Icon }) => (
        <li key={href}>
          <a
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={label}
            title={label}
            className='inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          >
            <Icon className='h-[1.125rem] w-[1.125rem]' aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Socials;
