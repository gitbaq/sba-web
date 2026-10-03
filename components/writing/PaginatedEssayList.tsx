"use client";

import { useMemo, useState } from "react";
import { SubTopic } from "@/types/types";
import EssayCard from "@/components/EssayCard";

const DEFAULT_PAGE_SIZE = 20;

type Props = {
  posts: SubTopic[];
  pageSize?: number;
  /** Optional heading id for the list region. */
  listLabel?: string;
};

/** Shared essay list with Previous/Next when count exceeds pageSize. */
export default function PaginatedEssayList({
  posts,
  pageSize = DEFAULT_PAGE_SIZE,
  listLabel = "Essays",
}: Props) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () =>
      posts.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [posts, currentPage, pageSize]
  );

  if (!posts.length) {
    return <p className='text-muted-foreground'>No essays yet.</p>;
  }

  return (
    <div className='flex flex-col gap-6'>
      <ul className='m-0 flex list-none flex-col p-0' aria-label={listLabel}>
        {pageItems.map((post) => (
          <li key={post.id}>
            <EssayCard post={post} />
          </li>
        ))}
      </ul>
      {posts.length > pageSize ? (
        <nav
          aria-label={`${listLabel} pages`}
          className='flex flex-wrap items-center justify-between gap-3'
        >
          <button
            type='button'
            className='inline-flex min-h-11 items-center text-sm font-semibold text-brand underline-offset-4 hover:underline disabled:opacity-40'
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <p className='text-sm tabular-nums text-muted-foreground'>
            Page {currentPage} of {totalPages}
          </p>
          <button
            type='button'
            className='inline-flex min-h-11 items-center text-sm font-semibold text-brand underline-offset-4 hover:underline disabled:opacity-40'
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </nav>
      ) : null}
    </div>
  );
}
