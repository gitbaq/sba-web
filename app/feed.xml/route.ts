import { NextResponse } from "next/server";
import { web_url } from "@/utils/endpoints/endpoints";
import { articleHref, extractTextFromHtml, isIndexable, postDate } from "@/lib/articles";
import { getAllSubtopicsSorted } from "@/utils/services/getLatestSubtopics";

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = (await getAllSubtopicsSorted()).filter(isIndexable);
  const buildDate = new Date().toUTCString();

  const items = posts
    .map((post) => {
      const link = `${web_url}${articleHref(post)}`;
      const title = escapeXml(post.subHeading || post.heading || "Essay");
      const description = escapeXml(extractTextFromHtml(post.content || "", 280));
      const pub = postDate(post);
      const pubDate = pub ? new Date(pub).toUTCString() : buildDate;
      const category = escapeXml(post.heading || post.sbaTopicName || "Writing");

      return `
    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${category}</category>
      <description>${description}</description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Syed Baqir Ali | Writing</title>
    <link>${web_url}/writing</link>
    <description>Research-depth essays on AI and software. Thorough, practical, and easy to follow.</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${web_url}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
