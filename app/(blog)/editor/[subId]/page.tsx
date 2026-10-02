import Editor from "@/components/editor/page";
import { readJson } from "@/lib/http";
import { subtopics_url } from "@/utils/endpoints/endpoints";
import Link from "next/link";

type Params = Promise<{ subId: string }>;

export default async function EditorHome({ params }: { params: Params }) {
  const { subId } = await params;
  const url = `${subtopics_url}/s/${subId}`;
  // Always load fresh essay data so saves are visible after refresh.
  let post = null;
  try {
    const data = await fetch(url, { cache: "no-store" });
    if (data.ok) {
      post = await readJson(data, null);
    }
  } catch {
    post = null;
  }

  if (!post || typeof post !== "object" || (post as { id?: unknown }).id == null) {
    return (
      <div className='flex justify-center p-8'>
        <div className='max-w-lg space-y-3'>
          <p className='text-muted-foreground'>
            Could not load this essay. The API may be restarting — try again in a
            moment.
          </p>
          <Link
            href='/admin/essays'
            className='text-brand underline-offset-4 hover:underline'
          >
            Back to essays
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='flex justify-center h-screen'>
      <div className='flex-1 w-full max-w-7xl h-full md:m-5 m-2'>
        <Editor params={{ subId: subId, post: post }} />
      </div>
    </div>
  );
}
