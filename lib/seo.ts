export const SITE = {
  name: "Syed Baqir Ali",
  url: "https://www.syedbaqirali.com",
  title: "Syed Baqir Ali | Practical Writing on AI and Software",
  description:
    "Practical notes on software, AI, and leading teams. New essays as they publish.",
  locale: "en_US",
  twitter: "@baq2coaching",
  linkedin: "https://www.linkedin.com/in/syedbaqirali",
  github: "https://github.com/gitbaq",
  x: "https://x.com/baq2coaching",
  calendly: "https://calendly.com/syedbaqirali/30min",
  ogImage: "https://www.syedbaqirali.com/ai4.png",
  email: "hello@syedbaqirali.com",
  tagline: "Practical notes on software, AI, and leading teams.",
} as const;

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Build route metadata with unique title, description, canonical, and OG. */
export function pageMeta({
  title,
  description,
  path,
  image,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  absoluteTitle?: boolean;
}): {
  title: string | { absolute: string };
  description: string;
  alternates: { canonical: string };
  openGraph: {
    title: string;
    description: string;
    url: string;
    type: "website";
    images?: { url: string; width: number; height: number; alt: string }[];
  };
  twitter: {
    card: "summary_large_image";
    title: string;
    description: string;
    images?: string[];
  };
} {
  const url = absoluteUrl(path);
  const ogTitle = absoluteTitle ? title : `${title} | ${SITE.name}`;
  const img = image || SITE.ogImage;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description,
      url,
      type: "website",
      images: [{ url: img, width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [img],
    },
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    url: SITE.url,
    jobTitle: "Software and AI practitioner",
    description: SITE.description,
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
