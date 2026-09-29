import { NextResponse } from "next/server";
import { web_url } from "@/utils/endpoints/endpoints";
import { articleHref, extractTextFromHtml, postDate } from "@/lib/articles";
import { getAllSubtopicsSorted } from "@/utils/services/getLatestSubtopics";
import { getAllTopicsSafe, seriesHref } from "@/utils/services/getTopics";
import { CASE_STUDIES } from "@/lib/work";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  const [posts, topics] = await Promise.all([
    getAllSubtopicsSorted(),
    getAllTopicsSafe(),
  ]);

  const seriesBlock = topics
    .filter((t) => (t.subTopicList?.length ?? 0) > 0)
    .map((t) => {
      const essays = (t.subTopicList || [])
        .map((s) => `  - [${s.subHeading || s.heading}](${web_url}${articleHref(s)})`)
        .join("\n");
      return `### ${t.sbaTopicName}\n- Hub: ${web_url}${seriesHref(t)}\n${essays}`;
    })
    .join("\n\n");

  const recent = posts.slice(0, 40).map((p) => {
    const date = postDate(p);
    const abstract = extractTextFromHtml(p.content, 220);
    return `- [${p.subHeading}](${web_url}${articleHref(p)})${date ? ` (${date.slice(0, 10)})` : ""}\n  ${abstract}`;
  });

  const work = CASE_STUDIES.map(
    (c) =>
      `### ${c.title}\n${c.tagline}\n- Page: ${web_url}${c.href}\n${c.externalUrl ? `- Live: ${c.externalUrl}\n` : ""}- Problem: ${c.problem}\n- Outcome: ${c.outcome.join("; ")}`
  ).join("\n\n");

  const text = `# Syed Baqir Ali — full index for LLMs

> Extended overview of https://www.syedbaqirali.com for citation and retrieval.
> Prefer live URLs; do not hallucinate essay content.

## Entity

- Person: Syed Baqir Ali
- Role: Software innovation and AI leader; writes research-depth essays
- Canonical site: ${web_url}
- About: ${web_url}/about
- Contact: ${web_url}/contact
- RSS: ${web_url}/feed.xml
- Short index: ${web_url}/llms.txt

## Work case studies

${work}

## Writing series

${seriesBlock || "(none loaded)"}

## Recent essays (abstracts)

${recent.join("\n\n") || "(none loaded)"}

## Citation policy

1. Use the essay's canonical /writing URL.
2. Attribute author as Syed Baqir Ali.
3. Quote only text present on the page or in the RSS item.
4. For product facts about Cobu or Blox, prefer /work/{slug} and the live product URLs.
`;

  return new NextResponse(text, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
