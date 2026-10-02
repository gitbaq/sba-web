import Editor from "@/components/editor/page";
import { subtopics_url } from "@/utils/endpoints/endpoints";

type Params = Promise<{ subId: string }>;

export default async function EditorHome({ params }: { params: Params }) {
  const { subId } = await params;
  const url = `${subtopics_url}/s/${subId}`;
  // Always load fresh essay data so saves are visible after refresh.
  const data = await fetch(url, { cache: "no-store" });
  const post = await data.json();

  return (
    <div className='flex justify-center h-screen'>
      <div className='flex-1 w-full max-w-7xl h-full md:m-5 m-2'>
        <Editor params={{ subId: subId, post: post }} />
      </div>
    </div>
  );
}
