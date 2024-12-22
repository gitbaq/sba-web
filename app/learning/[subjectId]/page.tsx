// import { Topic } from "@/types/types";

async function getTopicById(topicId: string) {
  const url = "http://localhost:8080/topics/v1/" + topicId;
  console.log(topicId + "Url is: " + url);
  const res = await fetch(url);

  return res.json();
}

async function Page({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = await params;

  const topic = await getTopicById(subjectId);
  // const [topic] = await Promise.all([topicData]);
  return (
    <div className='flex flex-col h-lvh min-h-lvh w-full min-w-full items-center justify-center'>
      <div className='flex flex-row h-full w-full items-center justify-center overflow-scroll p-10'>
        <div className='flex flex-col md:max-w-lg max-w-sm'>
          <p className='heading text-nowrap'>Learning {topic.sbaTopicName}</p>
          {/* <p className='heading'>Learning</p> */}
          &quot;The expert in anything was once a beginner.&quot; <br />
          <br />
          <div className='w-full text-right icons_diff text-pink-800'>
            Helen Hayes
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
