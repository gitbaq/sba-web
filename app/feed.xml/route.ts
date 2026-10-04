import { NextResponse } from "next/server";
import { web_url } from "@/utils/endpoints/endpoints";
import {
  articleHref,
  articleModifiedDate,
  extractTextFromHtml,
  isIndexable,
  postDate,
  prepareArticleHtml,
  stripEmojiFromHtml,
  stripEmojiFromText,
} from "@/lib/articles";
import { getAllSubtopicsSorted } from "@/utils/services/getLatestSubtopics";
import { findTopicForPost, getAllTopicsSafe } from "@/utils/services/getTopics";
import { enrichPostsWithSeries } from "@/lib/topicHubs";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const topics = await getAllTopicsSafe();
  const posts = enrichPostsWithSeries(
    (await getAllSubtopicsSorted()).filter(isIndexable),
    topics
  );

  const newest = posts.reduce((latest, post) => {
    const t = Date.parse(postDate(post) || articleModifiedDate(post) || "");
    return Number.isFinite(t) && t > latest ? t : latest;
  }, 0);
  const lastBuildDate = newest
    ? new Date(newest).toUTCString()
    : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const link = `${web_url}${articleHref(post)}`;
      const title = escapeXml(
        stripEmojiFromText(post.subHeading || post.heading || "Essay")
      );
      const dek = stripEmojiFromText((post.dek || "").trim());
      const description = escapeXml(
        dek || extractTextFromHtml(post.content || "", 280)
      );
      const pub = postDate(post);
      const pubDate = pub ? new Date(pub).toUTCString() : lastBuildDate;
      const seriesName =
        findTopicForPost(topics, post)?.sbaTopicName ||
        post.sbaTopicName ||
        "Writing"; // never use post.heading (legacy catalog label)
      const category = escapeXml(stripEmojiFromText(seriesName));
      const prepared = prepareArticleHtml(post.content || "", {
        title: post.subHeading,
        dek: post.dek?.trim(),
        essayId: post.id,
        series: seriesName,
      });
      // Full-text feed strips body emoji so readers and validators stay clean.
      const cdata = stripEmojiFromHtml(prepared).replace(
        /]]>/g,
        "]]]]><![CDATA[>"
      );

      return `
    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${category}</category>
      <description>${description}</description>
      <content:encoded><![CDATA[${cdata}]]></content:encoded>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Syed Baqir Ali | Writing</title>
    <link>${web_url}/writing</link>
    <description>Essays on AI, software, and systems. Practical delivery for engineers and technical leaders.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
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
