import { SubTopic } from "@/types/types";
import { subtopics_url } from "@/utils/endpoints/endpoints";
import { format } from "date-fns";
import "./articles.css";

import parse from "html-react-parser";
// import Image from "next/image";
import SharePanel from "@/components/social-sharing/sharebar";

async function getSubTopicById(subId: string) {
  const url = `${subtopics_url}/s/${subId}`;
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
    subtopic.imageUrl === null ? "/ai3.png" : subtopic.imageUrl;
  return (
    <main className='flex flex-col h-full w-full items-center overflow-y-auto px-2'>
      <section className='flex flex-col lg:w-3/5 w-full h-full py-2 justify-center'>
        <div className='flex flex-col rounded-t-xl px-5 py-2 self-center m-5 w-full border border-slate-100 bg-gradient-to-b from-transparent to-slate-50'>
          <div className='flex flex-row items-center text-slate-500 w-full gap-2'>
            <div className='heading'>{subtopic.heading}</div>
          </div>
          <div className='flex justify-between items-center text-slate-900 w-full'>
            <div className='flex flex-row font-extrabold text-amber-700'>
              {subtopic.subHeading}
            </div>
          </div>
          <div
            style={{
              backgroundImage: `url(${iURL})`,
            }}
            className={`flex justify-center p-5 items-center
              bg-center bg-opacity-20 bg-cover
          text-slate-900 self-center w-full min-h-96 my-10 rounded shadow`}
          >
            &nbsp;
          </div>
          <div className='flex justify-between items-center w-full font-thin text-slate-700'>
            <div>
              {format(subtopic.createDate, "MMM do, yyyy")} |{" "}
              <span className='text-transform: uppercase'>Editor</span>
            </div>

            <SharePanel subtopic={subtopic} />
          </div>
        </div>
      </section>
      <div className='lg:w-3/5 w-full py-3 px-2 h-full text-sm'>
        {parse(subtopic.content)}
      </div>
    </main>
  );
}
