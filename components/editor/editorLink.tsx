"use client";
import { useAuth } from "@/utils/AuthContext";
import Link from "next/link";
import Icons from "../Icons";

interface EditorLinkProps {
  topicId: number;
}

/** Admin-only edit entry to /editor/{id}. */
export default function EditorLink({ topicId }: EditorLinkProps) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <Link
      href={`/editor/${topicId}`}
      className='inline-flex min-h-11 items-center gap-1 text-brand hover:underline underline-offset-4'
    >
      <Icons.PencilLine size={16} aria-hidden />
      <span className='text-sm font-medium'>Edit</span>
    </Link>
  );
}
