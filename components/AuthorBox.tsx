import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/seo";

type Props = {
  className?: string;
};

export default function AuthorBox({ className = "" }: Props) {
  return (
    <aside
      className={[
        "flex flex-col gap-4 sm:flex-row sm:items-start rounded-lg border border-border bg-secondary/30 p-5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby='author-box'
    >
      <Image
        src='/sba-photo-2-small.png'
        alt={SITE.name}
        width={72}
        height={72}
        className='h-[72px] w-[72px] shrink-0 rounded-full object-cover ring-1 ring-border'
        sizes='72px'
      />
      <div className='flex flex-col gap-2'>
        <h2 id='author-box' className='font-display text-lg font-semibold'>
          {SITE.name}
        </h2>
        <p className='text-sm text-muted-foreground leading-relaxed max-w-xl'>
          I write and build at the intersection of AI research and enterprise
          engineering. Plain language, concrete tradeoffs.
        </p>
        <Link
          href='/about'
          className='w-fit text-sm font-semibold text-brand underline-offset-4 hover:underline min-h-11 inline-flex items-center'
        >
          More about me
        </Link>
      </div>
    </aside>
  );
}
