"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SubTopic, Topic } from "@/types/types";
import EssayCard from "@/components/EssayCard";
import { postTags } from "@/lib/articles";
import { seriesHref } from "@/utils/services/getTopics";
import { seriesStyle } from "@/lib/seriesColors";

type Props = {
  posts: SubTopic[];
  series: Topic[];
  initialQuery?: string;
  initialTag?: string;
};

export default function WritingIndex({
  posts,
  series,
  initialQuery = "",
  initialTag = "",
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [activeTag, setActiveTag] = useState(initialTag);

  const tags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => postTags(p).forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (activeTag) {
        const pt = postTags(p);
        if (!pt.includes(activeTag.toLowerCase())) return false;
      }
      if (!q) return true;
      const hay =
        `${p.heading} ${p.subHeading} ${p.sbaTopicName} ${p.dek || ""} ${p.tags || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [posts, query, activeTag]);

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col gap-4'>
        <div>
          <label htmlFor='writing-search' className='sr-only'>
            Search writing
          </label>
          <input
            id='writing-search'
            type='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search titles…'
            className='input-field w-full rounded-md bg-background px-3 py-2.5 text-sm min-h-11'
          />
        </div>

        {series.length > 0 && (
          <div>
            <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2'>
              Series
            </p>
            <ul className='flex flex-wrap gap-2 list-none p-0 m-0'>
              {series.map((t) => (
                <li key={t.id}>
                  <Link
                    href={seriesHref(t)}
                    className='series-chip'
                    style={seriesStyle(t.sbaTopicName)}
                  >
                    {t.sbaTopicName}
                    <span className='ml-1.5 opacity-70 tabular-nums'>
                      {t.subTopicList?.length ?? 0}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tags.length > 0 && (
          <div>
            <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2'>
              Tags
            </p>
            <ul className='flex flex-wrap gap-2 list-none p-0 m-0'>
              <li>
                <Link
                  href='/writing'
                  onClick={() => setActiveTag("")}
                  className={[
                    "inline-flex min-h-9 items-center rounded-full border px-3 text-sm transition-colors",
                    !activeTag
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-border text-muted-foreground hover:border-brand/40 hover:text-foreground",
                  ].join(" ")}
                >
                  All
                </Link>
              </li>
              {tags.map((tag) => {
                const active = activeTag.toLowerCase() === tag;
                return (
                  <li key={tag}>
                    <Link
                      href={`/writing?tag=${encodeURIComponent(tag)}`}
                      onClick={() => setActiveTag(tag)}
                      className={[
                        "inline-flex min-h-9 items-center rounded-full border px-3 text-sm transition-colors",
                        active
                          ? "border-brand bg-brand/10 text-brand"
                          : "border-border text-muted-foreground hover:border-brand/40 hover:text-foreground",
                      ].join(" ")}
                    >
                      {tag}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <p className='text-sm text-muted-foreground' aria-live='polite'>
        {filtered.length} {filtered.length === 1 ? "essay" : "essays"}
        {activeTag ? ` tagged “${activeTag}”` : ""}
      </p>

      {filtered.length === 0 ? (
        <p className='text-muted-foreground py-8'>
          No essays match.{" "}
          <button
            type='button'
            className='text-brand underline-offset-4 hover:underline'
            onClick={() => {
              setQuery("");
              setActiveTag("");
            }}
          >
            Clear filters
          </button>
        </p>
      ) : (
        <ul className='flex flex-col list-none p-0 m-0'>
          {filtered.map((post) => (
            <li key={post.id}>
              <EssayCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
