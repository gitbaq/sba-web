import { SubTopic } from "@/types/types";
import { web_url, ids_url } from "@/utils/endpoints/endpoints";
import { NextResponse } from "next/server";
import { articleHref, isIndexable } from "@/lib/articles";
import { getAllTopicsSafe, seriesHref } from "@/utils/services/getTopics";
import { CASE_STUDIES } from "@/lib/work";

function generateSiteMap(posts: SubTopic[], seriesUrls: string[]) {
  const currentDate = new Date().toISOString();

  const workCaseUrls = CASE_STUDIES.map(
    (c) => `
  <url>
    <loc>${web_url}${c.href}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>`
  ).join("");

  const seriesEntries = seriesUrls
    .map(
      (path) => `
  <url>
    <loc>${web_url}${path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>`
    )
    .join("");

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
    <loc>${web_url}/writing</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${web_url}/writing/series</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  ${seriesEntries}
  <url>
    <loc>${web_url}/feed.xml</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${web_url}/llms.txt</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${web_url}/llms-full.txt</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${web_url}/work</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  ${workCaseUrls}
  <url>
    <loc>${web_url}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${web_url}/subscribe</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${web_url}/privacy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${web_url}/for/hiring</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${web_url}/for/clients</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${web_url}/for/readers</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${web_url}/subscribe</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
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
      const path = articleHref(post);

      return `
  <url>
    <loc>${web_url}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${escapeXml(post.subHeading || "")}</image:title>
      <image:caption>${escapeXml(post.heading || "")}</image:caption>
    </image:image>
  </url>`;
    })
    .join("")}
</urlset>`;
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  try {
    const [postsRes, topics] = await Promise.all([
      fetch(ids_url, { next: { revalidate: 86400 } }),
      getAllTopicsSafe(),
    ]);
    if (!postsRes.ok) throw new Error(`HTTP error! status: ${postsRes.status}`);

    const posts = await postsRes.json();
    const seriesUrls = topics
      .filter((t) => (t.subTopicList?.length ?? 0) > 0)
      .map((t) => seriesHref(t));

    const indexable = (Array.isArray(posts) ? posts : []).filter(isIndexable);
    const sitemap = generateSiteMap(indexable, seriesUrls);

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
