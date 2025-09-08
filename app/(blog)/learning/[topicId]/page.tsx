import { SubTopic } from "@/types/types";
import { subtopics_url } from "@/utils/endpoints/endpoints";
import { format } from "date-fns";
import "./articles.css";

import parse from "html-react-parser";
import SharePanel from "@/components/social-sharing/sharebar";
import Image from "next/image";
import EditorLink from "@/components/editor/editorLink";

async function getSubTopicById(subId: string) {
  if (subId === null || subId === undefined || subId === "") {
    return;
  }
  const url = `${subtopics_url}/s/${subId}`;
  // console.log("url", url);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}

type Params = Promise<{ topicId: string; subId: string | undefined }>;

export default async function Page({ params }: { params: Params }) {
  const { topicId /*, subId*/ } = await params;

  const subtopic: SubTopic = await getSubTopicById(topicId);
  const iURL: string =
    subtopic.imageUrl === null ? "/ai4.png" : subtopic.imageUrl;
  return (
    <main className='flex flex-col h-full w-full items-center overflow-y-auto px-2'>
      <section className='flex flex-col w-full lg:max-w-4xl h-full justify-center'>
        <div className='flex flex-col rounded-t-xl px-2 py-2 self-center w-full'>
          <div className='flex flex-row items-center text-cyan-700 dark:text-cyan-500 w-full gap-2'>
            <div className='text-gray-500'>{subtopic.heading}</div>
          </div>
          <div className='flex justify-between items-center w-full'>
            <div className='flex flex-row justify-between w-full font-sans text-4xl font-bold py-3'>
              {subtopic.subHeading}
              <EditorLink topicId={subtopic.id} />
            </div>
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
            <div className='text-slate-500 dark:text-slate-400'>
              {format(subtopic.createDate, "MMM do, yyyy")}
            </div>

            <SharePanel subtopic={subtopic} />
          </div>
          {/* <div className='w-full border-b border-accent'>&nbsp;</div> */}
        </div>
      </section>
      <div className='w-full px-2 lg:max-w-4xl h-full article mb-10'>
        {parse(subtopic.content)}
      </div>
    </main>
  );
}
