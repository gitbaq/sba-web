import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import parse from "html-react-parser";
import { web_url } from "@/utils/endpoints/endpoints";
import {
  articleHref,
  articleModifiedDate,
  articleSlug,
  estimateReadingMinutes,
  extractTextFromHtml,
  extractToc,
  isIndexable,
  postDate,
  prepareArticleHtml,
  shouldShowUpdated,
  splitHtmlAtMidpoint,
} from "@/lib/articles";
import {
  getAllSubtopicsSorted,
  relatedPosts,
  resolveArticle,
} from "@/utils/services/getLatestSubtopics";
import EditorLink from "@/components/editor/editorLink";
import ArticleToc from "@/components/writing/ArticleToc";
import ArticleEndCta from "@/components/writing/ArticleEndCta";
import ReadingProgress from "@/components/writing/ReadingProgress";
import StickySubscribeBar from "@/components/writing/StickySubscribeBar";
import SeriesNav from "@/components/writing/SeriesNav";
import ArticleReadDepth from "@/components/writing/ArticleReadDepth";
import JsonLd from "@/components/JsonLd";
import TldrBlock from "@/components/TldrBlock";
import AuthorBox from "@/components/AuthorBox";
import EssayShareActions from "@/components/EssayShareActions";
import SubscribeForm from "@/components/SubscribeForm";
import { getAllTopicsSafe, getTopicById } from "@/utils/services/getTopics";
import { seriesStyle } from "@/lib/seriesColors";
import { breadcrumbJsonLd, pageMeta, SITE } from "@/lib/seo";
import { CTA } from "@/lib/ctas";
import { SUBSCRIBE } from "@/lib/copy";
import "./article.css";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const subtopic = await resolveArticle(slug);
  if (!subtopic) return {};

  const description =
    subtopic.dek || extractTextFromHtml(subtopic.content) || SITE.description;
  const imageUrl = subtopic.ogImageUrl || subtopic.imageUrl || undefined;
  const absoluteImage = imageUrl
    ? imageUrl.startsWith("http")
      ? imageUrl
      : `${web_url}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`
    : undefined;

  return pageMeta({
    title: subtopic.subHeading || subtopic.heading || "Essay",
    description,
    path: articleHref(subtopic),
    image: absoluteImage,
    ogType: "article",
    publishedTime: subtopic.publishDate,
    modifiedTime: articleModifiedDate(subtopic),
    authors: [SITE.name],
    section: subtopic.sbaTopicName || subtopic.heading,
    noIndex: !isIndexable(subtopic),
  });
}

export default async function WritingArticlePage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const subtopic = await resolveArticle(slug);
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
  const published = subtopic.publishDate || postDate(subtopic);
  const modified = articleModifiedDate(subtopic);
  const showUpdated = shouldShowUpdated(subtopic);
  const minutes = estimateReadingMinutes(subtopic.content || "");
  const html = prepareArticleHtml(subtopic.content || "", {
    title: subtopic.subHeading,
    dek: subtopic.dek?.trim(),
    essayId: subtopic.id,
  });
  const toc = extractToc(html);
  const [beforeMid, afterMid] = splitHtmlAtMidpoint(html);
  const iURL = subtopic.imageUrl || "/ai4.png";
  const topicLabel = subtopic.heading || subtopic.sbaTopicName;
  const url = `${web_url}${articleHref(subtopic)}`;
  const dek = subtopic.dek?.trim();
  const tldr = subtopic.tldr?.trim();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: subtopic.subHeading,
    description: dek || extractTextFromHtml(subtopic.content),
    image: subtopic.ogImageUrl || subtopic.imageUrl || `${web_url}/ai4.png`,
    datePublished: subtopic.publishDate,
    dateModified: modified,
    author: {
      "@type": "Person",
      name: SITE.name,
      url: web_url,
      sameAs: [SITE.linkedin, SITE.github, SITE.x],
    },
    publisher: {
      "@type": "Person",
      name: SITE.name,
      url: web_url,
      image: `${web_url}/sba-photo-2-small.png`,
      sameAs: [SITE.linkedin, SITE.github, SITE.x],
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    timeRequired: `PT${minutes}M`,
    abstract: tldr || extractTextFromHtml(subtopic.content, 280),
    articleSection: topicLabel || undefined,
    keywords: (subtopic.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
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

      <div className='life-hero life-hero-compact'>
        <div className='relative z-[2] mx-auto w-full max-w-3xl px-4 pt-4 pb-6 md:pt-5 md:pb-7'>
          <nav
            aria-label='Breadcrumb'
            className='mb-4 text-sm text-muted-foreground'
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

          <header className='flex flex-col gap-3'>
            <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
              {topicLabel && (
                <span className='series-label' style={seriesStyle(topicLabel)}>
                  {topicLabel}
                </span>
              )}
              <span className='ml-auto'>
                <EditorLink topicId={subtopic.id} />
              </span>
            </div>
            <h1 className='display-title text-3xl sm:text-4xl md:text-[2.75rem] text-foreground leading-[1.12]'>
              {subtopic.subHeading}
            </h1>
            {dek ? (
              <p className='text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl'>
                {dek}
              </p>
            ) : null}
            {tldr ? <TldrBlock tldr={tldr} className='mt-1' /> : null}

            <div className='flex flex-wrap items-center gap-3'>
              <Image
                src='/sba-photo-2-small.png'
                alt={SITE.name}
                width={40}
                height={40}
                className='h-10 w-10 rounded-full object-cover ring-1 ring-border'
                sizes='40px'
              />
              <div className='flex flex-col text-sm'>
                <span className='font-medium text-foreground'>{SITE.name}</span>
                <span className='text-xs text-muted-foreground tabular-nums'>
                  {published
                    ? format(new Date(published), "MMMM d, yyyy")
                    : null}
                  {showUpdated
                    ? ` · Updated ${format(new Date(modified), "MMM d, yyyy")}`
                    : null}
                  {` · ${minutes} min read`}
                </span>
              </div>
              <div className='ml-auto'>
                <EssayShareActions
                  url={url}
                  title={subtopic.subHeading || subtopic.heading}
                  summary={dek || subtopic.subHeading}
                />
              </div>
            </div>
          </header>
        </div>
      </div>

      <main className='mx-auto w-full max-w-3xl px-4 pt-4 pb-28 md:pt-5'>
        {subtopic.imageUrl && (
          <div className='relative mb-5 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-secondary ring-1 ring-border/80'>
            <Image
              priority
              fill
              src={iURL}
              alt={
                dek ||
                `${subtopic.subHeading || subtopic.heading} cover image`
              }
              className='object-cover'
              sizes='(max-width: 768px) 100vw, 768px'
            />
          </div>
        )}

        <ArticleToc items={toc} />

        <article className='article-prose'>{parse(beforeMid || html)}</article>

        {afterMid ? (
          <div className='my-12 rounded-lg border border-border bg-secondary/30 p-5 md:p-6'>
            <p className='accent-label mb-2'>{SUBSCRIBE.eyebrow}</p>
            <p className='mb-4 max-w-md text-sm leading-relaxed text-muted-foreground'>
              {SUBSCRIBE.heading}. {SUBSCRIBE.blurb}
            </p>
            <SubscribeForm variant='inline' submitLabel={CTA.subscribe} />
          </div>
        ) : null}

        {afterMid ? (
          <article className='article-prose'>{parse(afterMid)}</article>
        ) : null}

        <div className='mt-14 flex flex-col gap-10'>
          <AuthorBox />
          <SeriesNav topic={seriesTopic} currentId={subtopic.id} />
          <ArticleEndCta related={related} series={seriesTopic} />
        </div>
      </main>
    </>
  );
}
