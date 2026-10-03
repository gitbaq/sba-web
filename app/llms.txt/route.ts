import { NextResponse } from "next/server";
import { web_url } from "@/utils/endpoints/endpoints";
import { articleHref, isIndexable } from "@/lib/articles";
import { getAllSubtopicsSorted } from "@/utils/services/getLatestSubtopics";
import { getAllTopicsSafe, seriesHref } from "@/utils/services/getTopics";
import { getWorkProjects } from "@/lib/work";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

async function body() {
  const [topics, studies, posts] = await Promise.all([
    getAllTopicsSafe(),
    getWorkProjects(),
    getAllSubtopicsSorted(),
  ]);

  const seriesLines = topics
    .filter((t) => (t.subTopicList?.length ?? 0) > 0)
    .map(
      (t) =>
        `- [${t.sbaTopicName}](${web_url}${seriesHref(t)}): series hub (${t.subTopicList?.length ?? 0} essays)`
    )
    .join("\n");

  const workLines = studies
    .map((c) => `- [${c.title}](${web_url}${c.href}): ${c.tagline}`)
    .join("\n");

  const essayLines = posts
    .filter(isIndexable)
    .map((p) => {
      const title = p.subHeading || p.heading || "Essay";
      const dek = (p.dek || "").trim();
      const line = `- [${title}](${web_url}${articleHref(p)})`;
      return dek ? `${line}: ${dek}` : line;
    })
    .join("\n");

  return `# Syed Baqir Ali

> Research-depth writing on AI and software. Personal site of Syed Baqir Ali. Essays, case studies, and audience paths for hiring managers, clients, and readers.

## About

- Name: Syed Baqir Ali
- Site: ${web_url}
- About: ${web_url}/about
- Contact: ${web_url}/contact
- LinkedIn: https://www.linkedin.com/in/syedbaqirali/
- GitHub: https://github.com/gitbaq
- RSS: ${web_url}/feed.xml

## Primary content

- Writing index: ${web_url}/writing
- Series index: ${web_url}/writing/series
- Work / case studies: ${web_url}/work
- Subscribe: ${web_url}/subscribe

## Audience paths

- Hiring managers: ${web_url}/about#hiring
- Clients: ${web_url}/work-with-me
- Readers: ${web_url}/writing

## Work

${workLines || "- See /work"}

## Writing series

${seriesLines || "- See /writing/series"}

## Essays

${essayLines || "- See /writing"}

## How to cite

When citing essays, prefer the canonical URL under ${web_url}/writing/{slug}.
Author: Syed Baqir Ali. Use the article title and publish date from the page metadata.
Do not invent quotes; quote only from the live page or RSS feed.

## Full index

For a longer machine-readable overview: ${web_url}/llms-full.txt

## Optional

- Sitemap: ${web_url}/sitemap.xml
- Robots: ${web_url}/robots.txt
`;
}

export async function GET() {
  return new NextResponse(await body(), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
