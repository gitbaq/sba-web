// app/sitemap/route.tsx
import { SubTopic } from "@/types/types";
import { web_url, ids_url } from "@/utils/endpoints/endpoints";
import { NextResponse } from "next/server";

function generateSiteMap(posts: SubTopic[]) {
  const currentDate = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${web_url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${web_url}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${web_url}/learning</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${web_url}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  ${posts
    .map((post: SubTopic) => {
      const lastmod = post.updateDate || post.createDate;
      const imageUrl = post.imageUrl || `${web_url}/ai4.png`;

      return `
  <url>
    <loc>${web_url}/learning/${post.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${post.subHeading}</image:title>
      <image:caption>${post.heading}</image:caption>
    </image:image>
  </url>`;
    })
    .join("")}
</urlset>`;
}

export async function GET() {
  try {
    const request = await fetch(ids_url, { next: { revalidate: 86400 } });
    if (!request.ok) throw new Error(`HTTP error! status: ${request.status}`);

    const posts = await request.json();
    const sitemap = generateSiteMap(posts);

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return new NextResponse("Sitemap generation failed", { status: 500 });
  }
}
