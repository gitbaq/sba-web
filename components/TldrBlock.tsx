type Props = {
  tldr: string;
  className?: string;
};

export default function TldrBlock({ tldr, className = "" }: Props) {
  if (!tldr?.trim()) return null;
  return (
    <aside
      className={[
        "tldr-block rounded-lg border border-border bg-secondary/40 px-4 py-3 md:px-5 md:py-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label='Summary'
    >
      <p className='accent-label mb-2'>TL;DR</p>
      <p className='text-base md:text-[1.05rem] leading-relaxed text-foreground/90'>
        {tldr.trim()}
      </p>
    </aside>
  );
}
