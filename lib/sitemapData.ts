import type { MetadataRoute } from "next";
import { articleHref, articleModifiedDate, isIndexable } from "@/lib/articles";
import { SITE } from "@/lib/seo";
import {
  eligibleTopicHubs,
  enrichPostsWithSeries,
  essaysForTopicHub,
  topicHubHref,
} from "@/lib/topicHubs";
import { getWorkProjects } from "@/lib/work";
import { readJson } from "@/lib/http";
import { ids_url } from "@/utils/endpoints/endpoints";
import { getAllTopicsSafe, seriesHref } from "@/utils/services/getTopics";
import { SubTopic } from "@/types/types";

export type SitemapEntry = MetadataRoute.Sitemap[number];

function parseDate(value?: string | null): Date | undefined {
  if (!value) return undefined;
  const t = Date.parse(value);
  return Number.isFinite(t) ? new Date(t) : undefined;
}

function maxDate(dates: (Date | undefined)[]): Date | undefined {
  let best: Date | undefined;
  for (const d of dates) {
    if (!d) continue;
    if (!best || d.getTime() > best.getTime()) best = d;
  }
  return best;
}

function essayLastMod(post: SubTopic): Date | undefined {
  return parseDate(articleModifiedDate(post) || post.publishDate || post.createDate);
}

/** Indexable public URLs with lastModified from real content changes when known. */
export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const [postsRes, topics, studies] = await Promise.all([
    fetch(ids_url, { next: { revalidate: 86400 } }),
    getAllTopicsSafe(),
    getWorkProjects(),
  ]);

  const rawPosts = postsRes.ok ? await readJson<SubTopic[]>(postsRes, []) : [];
  const indexable = enrichPostsWithSeries(
    (Array.isArray(rawPosts) ? rawPosts : []).filter(isIndexable),
    topics
  );

  const essayDates = indexable.map(essayLastMod);
  const newestEssay = maxDate(essayDates);

  const seriesWithPosts = topics.filter(
    (t) => (t.subTopicList?.length ?? 0) > 0
  );
  const topicHubs = eligibleTopicHubs(indexable);

  const entries: SitemapEntry[] = [
    {
      url: SITE.url,
      lastModified: newestEssay,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE.url}/writing`,
      lastModified: newestEssay,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/writing/series`,
      lastModified: newestEssay,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/writing/topics`,
      lastModified: newestEssay,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE.url}/work`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/about`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/subscribe`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE.url}/contact`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE.url}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE.url}/for/hiring`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE.url}/for/clients`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE.url}/for/readers`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE.url}/feed.xml`,
      lastModified: newestEssay,
      changeFrequency: "daily",
      priority: 0.6,
    },
    {
      url: `${SITE.url}/llms.txt`,
      lastModified: newestEssay,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${SITE.url}/llms-full.txt`,
      lastModified: newestEssay,
      changeFrequency: "weekly",
      priority: 0.4,
    },
  ];

  for (const topic of seriesWithPosts) {
    const seriesPosts = (topic.subTopicList || []).filter(isIndexable);
    entries.push({
      url: `${SITE.url}${seriesHref(topic)}`,
      lastModified: maxDate(seriesPosts.map(essayLastMod)) || newestEssay,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  for (const hub of topicHubs) {
    const hubPosts = essaysForTopicHub(indexable, hub.tag);
    entries.push({
      url: `${SITE.url}${topicHubHref(hub.tag)}`,
      lastModified: maxDate(hubPosts.map(essayLastMod)) || newestEssay,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const study of studies) {
    entries.push({
      url: `${SITE.url}${study.href}`,
      changeFrequency: "monthly",
      priority: 0.75,
    });
  }

  for (const post of indexable) {
    entries.push({
      url: `${SITE.url}${articleHref(post)}`,
      lastModified: essayLastMod(post),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return entries;
}

/** RSS-style XML urlset for the legacy `/sitemap` route. */
export function entriesToXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((e) => {
      const lastmod = e.lastModified
        ? `<lastmod>${new Date(e.lastModified).toISOString()}</lastmod>`
        : "";
      const freq = e.changeFrequency
        ? `<changefreq>${e.changeFrequency}</changefreq>`
        : "";
      const priority =
        typeof e.priority === "number"
          ? `<priority>${e.priority.toFixed(1)}</priority>`
          : "";
      return `  <url>
    <loc>${e.url}</loc>
    ${lastmod}
    ${freq}
    ${priority}
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}
