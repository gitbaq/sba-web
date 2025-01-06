import Editor from "@/components/editor/page";

export default function Home() {
  return (
    <div className='flex flex-col w-full h-full items-center'>
      <div className='flex flex-col w-full h-full max-w-3xl p-5'>
        <Editor />
      </div>
    </div>
  );
}
