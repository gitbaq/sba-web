// components/editor/EditorLink.tsx
"use client";
import { useAuth } from "@/utils/AuthContext";
import Link from "next/link";
import Icons from "../Icons";

interface EditorLinkProps {
  topicId: number;
}

export default function EditorLink({ topicId }: EditorLinkProps) {
  const { isAuthenticated, userEmail } = useAuth();

  if (!isAuthenticated || userEmail !== "email3@email.com") {
    return null;
  }

  return (
    <Link
      href={`/editor/${topicId}`}
      className='flex items-center gap-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
    >
      <Icons.PencilLine size={16} />
      <span className='text-sm'>Edit</span>
    </Link>
  );
}
