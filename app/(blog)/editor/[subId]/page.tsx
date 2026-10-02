import Editor from "@/components/editor/page";
import { readJson } from "@/lib/http";
import { SubTopic } from "@/types/types";
import { subtopics_url } from "@/utils/endpoints/endpoints";
import Link from "next/link";

type Params = Promise<{ subId: string }>;

export default async function EditorHome({ params }: { params: Params }) {
  const { subId } = await params;
  const url = `${subtopics_url}/s/${subId}`;
  // Always load fresh essay data so saves are visible after refresh.
  let post: SubTopic | null = null;
  try {
    const data = await fetch(url, { cache: "no-store" });
    if (data.ok) {
      post = await readJson<SubTopic | null>(data, null);
    }
  } catch {
    post = null;
  }

  if (!post || post.id == null) {
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
    <div className='mx-auto w-full max-w-7xl px-2 pb-16 md:px-5 md:pb-20'>
      <Editor params={{ subId: subId, post }} />
    </div>
  );
}
