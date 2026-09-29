import { web_url } from "@/utils/endpoints/endpoints";

export const SITE = {
  name: "Syed Baqir Ali",
  url: web_url,
  title: "Syed Baqir Ali — AI & Software Writing",
  description:
    "Research-depth writing on AI and software. Subscribe for new essays, explore work, or find your path.",
  locale: "en_US",
  twitter: "@baq2coaching",
  linkedin: "https://www.linkedin.com/in/syedbaqirali",
  github: "https://github.com/gitbaq",
  ogImage: `${web_url}/ai4.png`,
  email: "contact via syedbaqirali.com/contact",
} as const;

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    url: SITE.url,
    jobTitle: "Software innovation and AI leader",
    description: SITE.description,
    sameAs: [SITE.linkedin, SITE.github, "https://www.codingburo.com"],
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
