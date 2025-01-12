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
    subtopic.imageUrl === null ? "/ai4.png" : subtopic.imageUrl;
  return (
    <main className='flex flex-col h-full w-full items-center overflow-y-auto py-3 px-2'>
      <section className='flex flex-col w-full h-full justify-center'>
        <div className='flex flex-col rounded-t-xl px-5 self-center w-full border border-slate-100 bg-gradient-to-t from-transparent to-slate-100'>
          <div className='flex flex-row items-center text-cyan-700 w-full gap-2'>
            <div className='heading'>{subtopic.heading}</div>
          </div>
          <div className='flex justify-between items-center text-slate-900 w-full'>
            <div className='flex flex-row font-semibold text-cyan-500'>
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
          <div className='flex justify-between items-center w-full text-slate-700 py-3'>
            <div>
              {format(subtopic.createDate, "MMM do, yyyy")}
              {/* |{" "} */}
              {/* <span className='text-transform: uppercase'>Editor</span> */}
            </div>

            <SharePanel subtopic={subtopic} />
          </div>
        </div>
      </section>
      <div className='w-full py-3 px-2 h-full text-sm article'>
        {parse(subtopic.content)}
      </div>
    </main>
  );
}
