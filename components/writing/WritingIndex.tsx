"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { SubTopic } from "@/types/types";
import {
  articleHref,
  estimateReadingMinutes,
  extractTextFromHtml,
  postDate,
} from "@/lib/articles";
import { isNewPost } from "@/utils/services/getLatestSubtopics";
import { seriesStyle } from "@/lib/seriesColors";

type Props = {
  posts: SubTopic[];
  initialQuery?: string;
};

export default function WritingIndex({ posts, initialQuery = "" }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [topic, setTopic] = useState<string>("all");

  const topics = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.heading) set.add(p.heading);
      else if (p.sbaTopicName) set.add(p.sbaTopicName);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const topicLabel = p.heading || p.sbaTopicName || "";
      if (topic !== "all" && topicLabel !== topic) return false;
      if (!q) return true;
      const hay = `${p.heading} ${p.subHeading} ${p.sbaTopicName}`.toLowerCase();
      return hay.includes(q);
    });
  }, [posts, query, topic]);

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col sm:flex-row gap-3 sm:items-end'>
        <div className='flex-1'>
          <label htmlFor='writing-search' className='sr-only'>
            Search writing
          </label>
          <input
            id='writing-search'
            type='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search titles…'
            className='input-field w-full rounded-md bg-background px-3 py-2 text-sm'
          />
        </div>
        <div>
          <label htmlFor='writing-topic' className='sr-only'>
            Filter by topic
          </label>
          <select
            id='writing-topic'
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className='input-field rounded-md bg-background px-3 py-2 text-sm min-w-[12rem]'
          >
            <option value='all'>All topics</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className='text-sm text-muted-foreground' aria-live='polite'>
        {filtered.length} {filtered.length === 1 ? "essay" : "essays"}
      </p>

      {filtered.length === 0 ? (
        <p className='text-muted-foreground py-8'>
          No essays match.{" "}
          <button
            type='button'
            className='text-brand underline-offset-4 hover:underline'
            onClick={() => {
              setQuery("");
              setTopic("all");
            }}
          >
            Clear filters
          </button>
        </p>
      ) : (
        <ul className='flex flex-col list-none p-0 m-0'>
          {filtered.map((post) => {
            const dateStr = postDate(post);
            const minutes = estimateReadingMinutes(post.content || "");
            const showNew = isNewPost(dateStr);
            const topicLabel = post.heading || post.sbaTopicName;
            const excerpt = extractTextFromHtml(post.content || "", 160);
            return (
              <li key={post.id}>
                <Link href={articleHref(post)} className='article-entry group'>
                  <div className='flex flex-wrap items-center gap-x-3 gap-y-1 mb-2'>
                    {showNew && (
                      <span className='text-[10px] font-bold uppercase tracking-wider text-spark'>
                        New
                      </span>
                    )}
                    {topicLabel && (
                      <span
                        className='series-label'
                        style={seriesStyle(topicLabel)}
                      >
                        {topicLabel}
                      </span>
                    )}
                    <span className='text-xs text-muted-foreground tabular-nums'>
                      {minutes} min read
                      {dateStr
                        ? ` · ${format(new Date(dateStr), "MMM d, yyyy")}`
                        : ""}
                    </span>
                  </div>
                  <h3 className='font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-brand transition-colors mb-2 leading-snug'>
                    {post.subHeading || post.heading}
                  </h3>
                  <p className='text-[0.95rem] text-muted-foreground leading-relaxed max-w-2xl'>
                    {excerpt}
                    {excerpt.length >= 160 ? "…" : ""}
                  </p>
                  <span className='inline-flex mt-3 text-sm font-semibold text-brand underline-offset-4 group-hover:underline'>
                    Read more
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
