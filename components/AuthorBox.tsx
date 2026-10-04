import Image from "next/image";
import Link from "next/link";
import { getAboutConfig } from "@/lib/work";

const OPTIMIZED_HOSTS = new Set([
  "sbaweb-bucket.s3.ap-southeast-2.amazonaws.com",
  "www.syedbaqirali.com",
  "ai.syedbaqirali.com",
]);

function shouldOptimize(src: string): boolean {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && OPTIMIZED_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

type Props = {
  className?: string;
};

export default async function AuthorBox({ className = "" }: Props) {
  const about = await getAboutConfig();

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
        src={about.photoUrl}
        alt={about.displayName}
        width={72}
        height={72}
        className='h-[72px] w-[72px] shrink-0 rounded-full object-cover ring-1 ring-border'
        sizes='72px'
        unoptimized={!shouldOptimize(about.photoUrl)}
      />
      <div className='flex flex-col gap-2'>
        <h2 id='author-box' className='font-display text-lg font-semibold'>
          {about.displayName}
        </h2>
        <p className='text-sm text-muted-foreground leading-relaxed max-w-xl'>
          {about.homeBlurb}
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
