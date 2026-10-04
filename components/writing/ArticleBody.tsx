import Image from "next/image";
import parse, { Element, type HTMLReactParserOptions } from "html-react-parser";

/** Hosts allowed by `images.remotePatterns` in next.config.ts. */
const OPTIMIZED_HOSTS = new Set([
  "sbaweb-bucket.s3.ap-southeast-2.amazonaws.com",
  "substack-post-media.s3.amazonaws.com",
  "ai.syedbaqirali.com",
  "www.syedbaqirali.com",
  "www.codingburo.com",
]);

const BODY_SIZES = "(max-width: 768px) 100vw, 768px";

function canOptimize(src: string): boolean {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && OPTIMIZED_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

function toDimension(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : fallback;
}

type Props = {
  html: string;
  /** Used to build alt text when an image has none. */
  title?: string;
  className?: string;
};

/** Server-rendered essay HTML. Body images go through next/image when allowed. */
export default function ArticleBody({ html, title, className }: Props) {
  let imageCount = 0;
  const options: HTMLReactParserOptions = {
    replace(node) {
      if (!(node instanceof Element) || node.name !== "img") return undefined;
      const src = node.attribs.src;
      if (!src) return undefined;
      imageCount += 1;
      const alt =
        node.attribs.alt?.trim() ||
        `${title || "Essay"}, figure ${imageCount}`;

      if (!canOptimize(src)) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={src} alt={alt} loading='lazy' decoding='async' />;
      }
      return (
        <Image
          src={src}
          alt={alt}
          width={toDimension(node.attribs.width, 1200)}
          height={toDimension(node.attribs.height, 675)}
          sizes={BODY_SIZES}
          style={{ width: "100%", height: "auto" }}
        />
      );
    },
  };

  return <article className={className}>{parse(html, options)}</article>;
}
