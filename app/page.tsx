import { Metadata } from "next";
import HomeGate from "@/components/home/HomeGate";
import { getLatestSubtopics } from "@/utils/services/getLatestSubtopics";
import { getAllTopicsSafe } from "@/utils/services/getTopics";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: SITE.title,
  },
  description: SITE.description,
  keywords: [
    "AI writing",
    "software innovation",
    "research essays",
    "Syed Baqir Ali",
  ],
  alternates: { canonical: SITE.url },
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    type: "website",
  },
};

export default async function Home() {
  const [posts, topics] = await Promise.all([
    getLatestSubtopics(10),
    getAllTopicsSafe(),
  ]);

  return (
    <div className='w-full min-h-[70vh]'>
      <HomeGate posts={posts} topics={topics} />
    </div>
  );
}
