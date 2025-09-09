// app/robots.txt/route.ts
import { web_url } from "@/utils/endpoints/endpoints";

export function GET() {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${web_url}/sitemap

Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /temp/

Allow: /learning/
Allow: /about/
Allow: /contact/`;

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
