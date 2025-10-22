import { Metadata } from "next";
import { SubTopic } from "@/types/types";
import { subtopics_url, web_url } from "@/utils/endpoints/endpoints";
import { format } from "date-fns";
import "./articles.css";

import parse from "html-react-parser";
import SharePanel from "@/components/social-sharing/sharebar";
import Image from "next/image";
import EditorLink from "@/components/editor/editorLink";
import { toast } from "sonner";

async function getSubTopicById(subId: string) {
  if (subId === null || subId === undefined || subId === "") {
    return;
  }
  const url = `${subtopics_url}/s/${subId}`;
  // console.log("url", url);
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}

function extractTextFromHtml(html: string, maxLength: number = 160): string {
  const text = html
    .replace(/<[^>]*>/g, "")
    .substring(0, maxLength)
    .trim();
  return text || "Learn more about this topic"; // Add fallback
}

type Params = Promise<{ topicId: string; subId: string | undefined }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { topicId } = await params;

  try {
    const subtopic: SubTopic = await getSubTopicById(topicId);
    if (!subtopic) return {};

    const description = extractTextFromHtml(subtopic.content);
    const imageUrl = subtopic.imageUrl || `${web_url}/ai4.png`;
    const url = `${web_url}/learning/${topicId}`;

    return {
      title: `${subtopic.subHeading} | ${subtopic.heading}`,
      description,
      keywords: [
        subtopic.heading,
        subtopic.sbaTopicName,
        "tutorial",
        "learning",
      ],
      authors: [{ name: "Syed Baqir Ali" }],
      openGraph: {
        title: subtopic.subHeading,
        description,
        url,
        siteName: "Syed B - Innovate, Lead, Succeed",
        images: [
          { url: imageUrl, width: 1200, height: 630, alt: subtopic.heading },
        ],
        locale: "en_US",
        type: "article",
        publishedTime: subtopic.publishDate,
        modifiedTime: subtopic.updateDate,
        section: subtopic.sbaTopicName,
        tags: [subtopic.heading, subtopic.sbaTopicName],
      },
      twitter: {
        card: "summary_large_image",
        title: subtopic.subHeading,
        description,
        images: [imageUrl],
      },
      alternates: { canonical: url },
    };
  } catch {
    return {};
  }
}

export default async function Page({ params }: { params: Params }) {
  const { topicId /*, subId*/ } = await params;

  let subtopic: SubTopic | null = null;

  try {
    subtopic = await getSubTopicById(topicId);
  } catch (error) {
    toast.error("Failed to fetch this post:", error);
    // Return error page or redirect
    return <div>Failed to load content</div>;
  }

  if (!subtopic) {
    return <div>Content not found</div>;
  }
  const iURL = subtopic.imageUrl || "/ai4.png";
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
              "@type": "Organization",
              name: "Syed B",
              logo: {
                "@type": "ImageObject",
                url: `${web_url}/sba-green.png`,
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${web_url}/learning/${topicId}`,
            },
          }),
        }}
      />
      <main className='flex flex-col h-full w-full items-center overflow-y-auto px-2 '>
        <section className='flex flex-col w-full lg:max-w-5xl h-full justify-center'>
          <div className='flex flex-col rounded-t-xl px-2 py-2 self-center w-full'>
            <div className='flex flex-row items-center text-cyan-700 dark:text-cyan-500 w-full gap-2'>
              <div className='text-amber-700 uppercase'>{subtopic.heading}</div>
            </div>
            <div className='flex justify-between items-center w-full'>
              <h1 className='flex flex-row justify-between w-full font-sans text-4xl font-bold py-3'>
                {subtopic.subHeading}
                <EditorLink topicId={subtopic.id} />
              </h1>
            </div>

            <div className='bg-gray-300 min-h-96 max-w-full aspect-video rounded-lg relative p-5'>
              <Image
                priority
                fill
                src={iURL}
                alt={subtopic.heading}
                className='object-cover w-full max-h-full rounded'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              ></Image>
            </div>
            <div className='flex flex-row justify-between items-end w-full border-y my-5 py-5'>
              <time
                className='text-slate-500 dark:text-slate-400'
                dateTime={subtopic.createDate}
              >
                {format(subtopic.createDate, "MMM do, yyyy")}
              </time>

              <SharePanel subtopic={subtopic} />
            </div>
            {/* <div className='w-full border-b border-accent'>&nbsp;</div> */}
          </div>
        </section>
        <article className='w-full px-5 lg:max-w-4xl h-full article mb-10 bg-accent border rounded-lg'>
          {parse(subtopic.content)}
        </article>
      </main>
    </>
  );
}
