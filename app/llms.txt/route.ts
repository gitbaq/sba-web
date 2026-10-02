import { NextResponse } from "next/server";
import { web_url } from "@/utils/endpoints/endpoints";
import { getAllTopicsSafe, seriesHref } from "@/utils/services/getTopics";
import { CASE_STUDIES } from "@/lib/work";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

function body(topics: Awaited<ReturnType<typeof getAllTopicsSafe>>) {
  const seriesLines = topics
    .filter((t) => (t.subTopicList?.length ?? 0) > 0)
    .map(
      (t) =>
        `- [${t.sbaTopicName}](${web_url}${seriesHref(t)}): series hub (${t.subTopicList?.length ?? 0} essays)`
    )
    .join("\n");

  const workLines = CASE_STUDIES.map(
    (c) => `- [${c.title}](${web_url}${c.href}): ${c.tagline}`
  ).join("\n");

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

- Hiring managers: ${web_url}/for/hiring
- Clients: ${web_url}/for/clients
- Readers: ${web_url}/for/readers

## Work

${workLines || "- See /work"}

## Writing series

${seriesLines || "- See /writing/series"}

## How to cite

When citing essays, prefer the canonical URL under ${web_url}/writing/{slug}.
Author: Syed Baqir Ali. Use the article title and publish date from the page metadata.
Do not invent quotes; quote only from the live page or RSS feed.

## Full index

For a longer machine-readable overview: ${web_url}/llms-full.txt

## Optional

- Sitemap: ${web_url}/sitemap
- Robots: ${web_url}/robots.txt
`;
}

export async function GET() {
  const topics = await getAllTopicsSafe();
  return new NextResponse(body(topics), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
