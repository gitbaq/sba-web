import type { Metadata } from "next";

export const SITE = {
  name: "Syed Baqir Ali",
  url: "https://www.syedbaqirali.com",
  title: "Syed Baqir Ali | Practical Writing on AI and Software",
  description:
    "Principal engineer and AI practitioner in Sydney. Essays, shipped products, and practical delivery for teams.",
  locale: "en_US",
  twitter: "@baq2coaching",
  linkedin: "https://www.linkedin.com/in/syedbaqirali/",
  github: "https://github.com/gitbaq",
  x: "https://x.com/baq2coaching",
  calendly: "https://calendly.com/syedbaqirali/30min",
  ogImage: "https://www.syedbaqirali.com/ai4.png",
  email: "hello@syedbaqirali.com",
  tagline: "Principal engineer and AI practitioner in Sydney.",
} as const;

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

function clampDescription(text: string, max = 155): string {
  const clean = text
    .replace(/\u2014/g, ". ")
    .replace(/\u2013/g, "-")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /**
   * Explicit image URL, or `null` to omit so a route `opengraph-image` can provide it.
   * When omitted (`undefined`), falls back to `SITE.ogImage`.
   */
  image?: string | null;
  /** Use when title already includes the brand (home). */
  absoluteTitle?: boolean;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  noIndex?: boolean;
};

/**
 * Central metadata for website, article, and project routes.
 * Sets unique title, description, canonical, and matching OG + Twitter tags.
 * Never sets meta keywords.
 */
export function pageMeta({
  title,
  description,
  path,
  image,
  absoluteTitle = false,
  ogType = "website",
  publishedTime,
  modifiedTime,
  authors,
  section,
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const desc = clampDescription(description);
  const ogTitle = absoluteTitle ? title : `${title} | ${SITE.name}`;
  // null omits images so route opengraph-image.tsx can supply them.
  const img = image === null ? undefined : image || SITE.ogImage;
  const images = img
    ? [{ url: img, width: 1200, height: 630, alt: title || SITE.name }]
    : undefined;
  const openGraph: Metadata["openGraph"] =
    ogType === "article"
      ? {
          title: ogTitle,
          description: desc,
          url,
          siteName: SITE.name,
          locale: SITE.locale,
          type: "article",
          publishedTime,
          modifiedTime,
          authors: authors?.length ? authors : [SITE.name],
          section,
          images,
        }
      : {
          title: ogTitle,
          description: desc,
          url,
          siteName: SITE.name,
          locale: SITE.locale,
          type: "website",
          images,
        };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: desc,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: desc,
      images: img ? [img] : undefined,
      creator: SITE.twitter,
    },
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    url: SITE.url,
    jobTitle: "Principal engineer and AI practitioner",
    description: SITE.description,
    knowsAbout: [
      "Artificial intelligence",
      "Software engineering",
      "RAG",
      "Agents",
      "Cloud-native delivery",
    ],
    sameAs: [SITE.linkedin, SITE.github, SITE.x, "https://www.codingburo.com"],
    image: `${SITE.url}/sba-photo-2-small.png`,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: "en",
    publisher: {
      "@type": "Person",
      name: SITE.name,
      url: SITE.url,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/writing?query={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function professionalServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE.name,
    url: absoluteUrl("/work-with-me"),
    description:
      "Software and AI delivery: custom AI solutions, cloud integration, and product engineering.",
    image: SITE.ogImage,
    email: SITE.email,
    sameAs: [SITE.linkedin, SITE.github, SITE.x, "https://www.codingburo.com"],
    areaServed: "Worldwide",
    serviceType: [
      "Custom AI solutions",
      "Cloud integration",
      "Book review and authoring",
      "Teaching and workshops",
    ],
  };
}

export function projectJsonLd(input: {
  title: string;
  description: string;
  path: string;
  image?: string;
  externalUrl?: string;
  dateCreated?: string;
}) {
  const sameAs = input.externalUrl ? [input.externalUrl] : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    image: input.image || SITE.ogImage,
    dateCreated: input.dateCreated,
    author: {
      "@type": "Person",
      name: SITE.name,
      url: SITE.url,
    },
    sameAs,
  };
}
