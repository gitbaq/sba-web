import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import parse from "html-react-parser";
import { web_url } from "@/utils/endpoints/endpoints";
import {
  articleHref,
  articleSlug,
  estimateReadingMinutes,
  extractTextFromHtml,
  extractToc,
  injectHeadingIds,
  parseArticleParam,
  postDate,
} from "@/lib/articles";
import {
  getAllSubtopicsSorted,
  getSubTopicById,
  relatedPosts,
} from "@/utils/services/getLatestSubtopics";
import SharePanel from "@/components/social-sharing/sharebar";
import EditorLink from "@/components/editor/editorLink";
import ArticleToc from "@/components/writing/ArticleToc";
import ArticleEndCta from "@/components/writing/ArticleEndCta";
import ReadingProgress from "@/components/writing/ReadingProgress";
import StickySubscribeBar from "@/components/writing/StickySubscribeBar";
import SeriesNav from "@/components/writing/SeriesNav";
import ArticleReadDepth from "@/components/writing/ArticleReadDepth";
import JsonLd from "@/components/JsonLd";
import { getAllTopicsSafe, getTopicById } from "@/utils/services/getTopics";
import { seriesStyle } from "@/lib/seriesColors";
import { breadcrumbJsonLd } from "@/lib/seo";
import "./article.css";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseArticleParam(slug);
  if (!parsed) return {};

  const subtopic = await getSubTopicById(parsed.id);
  if (!subtopic) return {};

  const description = extractTextFromHtml(subtopic.content);
  const imageUrl = subtopic.imageUrl || `${web_url}/ai4.png`;
  const canonicalPath = articleHref(subtopic);
  const url = `${web_url}${canonicalPath}`;

  return {
    title: `${subtopic.subHeading} | Writing`,
    description,
    keywords: [subtopic.heading, subtopic.sbaTopicName, "AI", "writing"].filter(
      Boolean
    ) as string[],
    authors: [{ name: "Syed Baqir Ali" }],
    openGraph: {
      title: subtopic.subHeading,
      description,
      url,
      siteName: "Syed Baqir Ali",
      images: [
        { url: imageUrl, width: 1200, height: 630, alt: subtopic.heading },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: subtopic.publishDate,
      modifiedTime: subtopic.updateDate,
      section: subtopic.sbaTopicName || subtopic.heading,
      tags: [subtopic.heading, subtopic.sbaTopicName].filter(Boolean) as string[],
    },
    twitter: {
      card: "summary_large_image",
      title: subtopic.subHeading,
      description,
      images: [imageUrl],
    },
    alternates: { canonical: url },
  };
}

export default async function WritingArticlePage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const parsed = parseArticleParam(slug);
  if (!parsed) notFound();

  const subtopic = await getSubTopicById(parsed.id);
  if (!subtopic) notFound();

  const canonical = articleSlug(subtopic);
  if (slug !== canonical) {
    permanentRedirect(articleHref(subtopic));
  }

  const all = await getAllSubtopicsSorted();
  const related = relatedPosts(subtopic, all, 3);
  const topics = await getAllTopicsSafe();
  const seriesTopic =
    getTopicById(topics, subtopic.topicId) ||
    topics.find(
      (t) =>
        t.sbaTopicName === subtopic.sbaTopicName ||
        t.subTopicList?.some((s) => s.id === subtopic.id)
    );
  const dateStr = postDate(subtopic);
  const minutes = estimateReadingMinutes(subtopic.content || "");
  const toc = extractToc(subtopic.content || "");
  const html = injectHeadingIds(subtopic.content || "");
  const iURL = subtopic.imageUrl || "/ai4.png";
  const topicLabel = subtopic.heading || subtopic.sbaTopicName;
  const url = `${web_url}${articleHref(subtopic)}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: subtopic.subHeading,
    description: extractTextFromHtml(subtopic.content),
    image: subtopic.imageUrl || `${web_url}/ai4.png`,
    datePublished: subtopic.publishDate,
    dateModified: subtopic.updateDate,
    author: {
      "@type": "Person",
      name: "Syed Baqir Ali",
      url: web_url,
    },
    publisher: {
      "@type": "Person",
      name: "Syed Baqir Ali",
      url: web_url,
      image: `${web_url}/sba-photo-2-small.png`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    timeRequired: `PT${minutes}M`,
    abstract: extractTextFromHtml(subtopic.content, 280),
  };

  return (
    <>
      <JsonLd data={articleLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Writing", path: "/writing" },
          { name: subtopic.subHeading, path: articleHref(subtopic) },
        ])}
      />
      <ArticleReadDepth slug={canonical} title={subtopic.subHeading} />
      <ReadingProgress />
      <StickySubscribeBar />

      <div className='life-hero'>
        <div className='relative z-[2] mx-auto w-full max-w-3xl px-4 pt-6 pb-12 md:pt-8 md:pb-16'>
          <nav
            aria-label='Breadcrumb'
            className='mb-6 text-sm text-muted-foreground'
          >
            <Link
              href='/writing'
              className='hover:text-brand underline-offset-4 hover:underline'
            >
              Writing
            </Link>
            <span aria-hidden className='mx-2'>
              /
            </span>
            <span className='text-foreground line-clamp-1'>
              {subtopic.subHeading}
            </span>
          </nav>

          <header className='flex flex-col gap-4'>
            <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
              {topicLabel && (
                <span className='series-label' style={seriesStyle(topicLabel)}>
                  {topicLabel}
                </span>
              )}
              <span className='text-xs text-muted-foreground tabular-nums'>
                {minutes} min read
                {dateStr
                  ? ` · ${format(new Date(dateStr), "MMMM d, yyyy")}`
                  : ""}
              </span>
              <span className='ml-auto'>
                <EditorLink topicId={subtopic.id} />
              </span>
            </div>
            <h1 className='display-title text-3xl sm:text-4xl md:text-[2.75rem] text-foreground leading-[1.12]'>
              {subtopic.subHeading}
            </h1>
            <div className='flex flex-row flex-wrap items-center justify-between gap-4 pt-2'>
              <SharePanel subtopic={subtopic} shareUrl={url} />
            </div>
          </header>
        </div>
      </div>

      <main className='mx-auto w-full max-w-3xl px-4 py-10 md:py-12 pb-28'>
        {subtopic.imageUrl && (
          <div className='relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10 bg-secondary ring-1 ring-border/80'>
            <Image
              priority
              fill
              src={iURL}
              alt={subtopic.heading || subtopic.subHeading}
              className='object-cover'
              sizes='(max-width: 768px) 100vw, 768px'
            />
          </div>
        )}

        <SeriesNav topic={seriesTopic} currentId={subtopic.id} />
        <ArticleToc items={toc} />

        <article className='article-prose'>{parse(html)}</article>

        <ArticleEndCta related={related} series={seriesTopic} />
      </main>
    </>
  );
}
