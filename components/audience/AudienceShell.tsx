import Link from "next/link";
import { ReactNode } from "react";
import Icons from "@/components/Icons";
import { CTA, CTA_ORDER, type CtaKey } from "@/lib/ctas";

type CtaIcon =
  | "linkedin"
  | "mail"
  | "contact"
  | "work"
  | "writing"
  | "calendar"
  | "external";

type Cta = {
  href: string;
  label: string;
  external?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  icon?: CtaIcon;
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  ctas: Cta[];
  children: ReactNode;
};

const LABEL_TO_KEY = new Map<string, CtaKey>(
  (Object.entries(CTA) as [CtaKey, string][]).map(([key, label]) => [
    label,
    key,
  ])
);

function sortCtas(ctas: Cta[]): Cta[] {
  return [...ctas].sort((a, b) => {
    const ai = CTA_ORDER.indexOf(LABEL_TO_KEY.get(a.label) ?? "linkedin");
    const bi = CTA_ORDER.indexOf(LABEL_TO_KEY.get(b.label) ?? "linkedin");
    return ai - bi;
  });
}

function CtaGlyph({ icon }: { icon?: CtaIcon }) {
  if (!icon) return null;
  const cls = "craft-cta-icon";
  switch (icon) {
    case "linkedin":
      return <Icons.FaLinkedin className={cls} aria-hidden />;
    case "mail":
      return <Icons.Mail className={cls} aria-hidden />;
    case "contact":
      return <Icons.MessageSquareCode className={cls} aria-hidden />;
    case "work":
      return <Icons.FolderCode className={cls} aria-hidden />;
    case "writing":
      return <Icons.BookOpen className={cls} aria-hidden />;
    case "calendar":
      return <Icons.FaCalendarDays className={cls} aria-hidden />;
    case "external":
      return <Icons.ExternalLink className={cls} aria-hidden />;
    default:
      return null;
  }
}

function CtaLink({ href, label, external, variant = "secondary", icon }: Cta) {
  const styles =
    variant === "primary" ? "craft-cta-primary" : "craft-cta-secondary";

  const content = (
    <>
      <CtaGlyph icon={icon} />
      {label}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        className={styles}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={styles}>
      {content}
    </Link>
  );
}

export default function AudienceShell({
  eyebrow,
  title,
  description,
  ctas,
  children,
}: Props) {
  const ordered = sortCtas(ctas);

  return (
    <div className='w-full'>
      <div className='life-hero'>
        <header className='relative z-[2] mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pt-6 pb-12 md:pt-8 md:pb-16'>
          <p className='accent-label'>{eyebrow}</p>
          <h1 className='display-title text-4xl md:text-5xl text-foreground'>
            {title}
          </h1>
          <p className='text-lg leading-relaxed text-foreground/80 max-w-xl'>
            {description}
          </p>
          <div className='flex flex-wrap gap-3 pt-2'>
            {ordered.map((c) => (
              <CtaLink key={c.label + c.href} {...c} />
            ))}
          </div>
        </header>
      </div>

      <main className='mx-auto flex w-full max-w-3xl flex-col gap-12 px-4 py-10 md:py-14'>
        {children}

        <p className='text-sm text-muted-foreground border-t border-border/80 pt-8'>
          Wrong path?{" "}
          <Link
            href='/'
            className='text-brand font-medium underline-offset-4 hover:underline'
          >
            Choose again on the home page
          </Link>
          {" · "}
          <Link
            href='/about'
            className='underline-offset-4 hover:underline hover:text-brand'
          >
            About
          </Link>
        </p>
      </main>
    </div>
  );
}
