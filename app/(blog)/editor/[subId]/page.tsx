"use client";
import Editor from "@/components/editor/page";
import { useEffect, useState } from "react";

type Params = Promise<{ subId: string }>;
export default function EditorHome({ params }: { params: Params }) {
  const [subId, setSubId] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      setSubId((await params).subId);
      console.log(`Sub Id: ${subId}`);
    };

    fetchData().catch((e) => {
      console.error("An error occurred while fetching the data: ", e);
    });
  });
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
