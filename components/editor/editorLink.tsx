"use client";
import Icons from "@/components/Icons";
import Link from "next/link";

export default function EditorLink({ topicId }: { topicId: number }) {
  return (
    <Link href={`/editor/${topicId}`}>
      <Icons.PencilLine className='text-amber-500 icons-size' />
    </Link>
  );
}
