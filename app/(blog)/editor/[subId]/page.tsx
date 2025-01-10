import Editor from "@/components/editor/page";

type Params = Promise<{ subId: string | undefined }>;
export default async function EditorHome({ params }: { params: Params }) {
  const { subId } = await params;
  return (
    <div className='flex flex-col w-full h-full items-center'>
      <div className='flex flex-row w-full h-full'>
        <div className='h-full w-full min-h-screen'>
          <Editor params={{ subId: subId }} />
        </div>
      </div>
    </div>
  );
}
