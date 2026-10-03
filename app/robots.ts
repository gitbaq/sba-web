import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

/**
 * Crawler policy for syedbaqirali.com.
 * Allows search engines and common AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended).
 * Owner can tighten this file later if needed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/_next/", "/temp/", "/editor/"],
      },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "Bytespider", disallow: "/" },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
