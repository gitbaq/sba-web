import { SubTopic } from "@/types/types";
import { subtopics_url } from "@/utils/endpoints/endpoints";
import { format } from "date-fns";
import "./articles.css";

import parse from "html-react-parser";
import SharePanel from "@/components/social-sharing/sharebar";
import EditorLink from "@/components/editor/editorLink";

async function getSubTopicById(subId: string) {
  if (subId === null || subId === undefined || subId === "") {
    return;
  }
  const url = `${subtopics_url}/s/${subId}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  debugger;
  return res.json();
}

type Params = Promise<{ topicId: string; subId: string | undefined }>;

export default async function Page({ params }: { params: Params }) {
  const { topicId /*, subId*/ } = await params;

  const subtopic: SubTopic = await getSubTopicById(topicId);
  const iURL: string =
    subtopic.imageUrl === null ? "/ai4.png" : subtopic.imageUrl;
  return (
    <main className='flex flex-col h-full w-full items-center overflow-y-auto my-10'>
      <section className='flex flex-col w-full h-full justify-center'>
        <div className='flex flex-col rounded-t-xl px-2 py-2 self-center w-full border-b border-accent'>
          <div className='flex flex-row items-center text-cyan-700 dark:text-cyan-500 w-full gap-2'>
            <div className='heading'>{subtopic.heading}</div>
          </div>
          <div className='flex justify-between items-center w-full'>
            <div className='flex flex-row justify-between w-full heading'>
              {subtopic.subHeading} <EditorLink topicId={subtopic.id} />
            </div>
          </div>
          <div
            style={{
              backgroundImage: `url(${iURL})`,
            }}
            className={`flex justify-center p-5 items-center
               bg-auto opacity-80 bg-center
           w-full min-h-96 my-5 rounded shadow`}
          >
            &nbsp;
          </div>
          <div className='flex flex-row justify-between items-end w-full'>
            <div className='text-slate-500 dark:text-slate-400'>
              {format(subtopic.createDate, "MMM do, yyyy")}
            </div>

            <SharePanel subtopic={subtopic} />
          </div>
          {/* <div className='w-full border-b border-accent'>&nbsp;</div> */}
        </div>
      </section>
      <div className='w-full px-2 h-full text-sm article lg:max-w-3xl'>
        {parse(subtopic.content)}
      </div>
    </main>
  );
}
