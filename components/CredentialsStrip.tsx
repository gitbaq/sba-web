import { Credential } from "@/lib/work";

type Props = {
  className?: string;
  credentials: Credential[];
};

export default function CredentialsStrip({
  className = "",
  credentials,
}: Props) {
  if (!credentials?.length) return null;

  return (
    <ul
      className={[
        "m-0 grid list-none gap-3 p-0 sm:grid-cols-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label='Credentials'
    >
      {credentials.map((item) => (
        <li
          key={item.label}
          className='flex items-start gap-3 rounded-lg border border-border/80 bg-card px-4 py-3 text-sm leading-relaxed text-foreground'
        >
          <span
            className='mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand'
            aria-hidden
          />
          {item.href ? (
            <a
              href={item.href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-brand font-medium underline-offset-4 hover:underline'
            >
              {item.label}
            </a>
          ) : (
            <span>{item.label}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
