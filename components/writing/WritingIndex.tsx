"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SubTopic, Topic } from "@/types/types";
import EssayCard from "@/components/EssayCard";
import { isIndexable, postTags } from "@/lib/articles";
import { seriesHref } from "@/utils/services/getTopics";
import { seriesStyle } from "@/lib/seriesColors";
import { topicHubHref, topicHubSlug } from "@/lib/topicHubs";

/** Only tags used by this many essays are shown as filters. */
const MIN_TAG_ESSAYS = 2;
const ACRONYMS = new Set(["ai", "nlp", "llm", "llms", "ml", "gpt", "bert", "api", "gpu"]);

type Props = {
  posts: SubTopic[];
  series: Topic[];
  initialQuery?: string;
  initialTag?: string;
  /** Tags with enough essays for a hub page (P3-13). */
  hubTags?: string[];
  /** When true, list is already server-filtered; skip client query filter. */
  serverSearchActive?: boolean;
};

export default function WritingIndex({
  posts,
  series,
  initialQuery = "",
  initialTag = "",
  hubTags = [],
  serverSearchActive = false,
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [activeTag, setActiveTag] = useState(initialTag);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const { tags, tagLabels } = useMemo(() => {
    const counts = new Map<string, number>();
    const labels = new Map<string, string>();
    posts.forEach((p) => {
      const raw = (p.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
      const seen = new Set<string>();
      raw.forEach((t) => {
        const key = t.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        counts.set(key, (counts.get(key) || 0) + 1);
        const hasUpper = /[A-Z]/.test(t);
        if (hasUpper && !labels.has(key)) labels.set(key, t);
      });
    });
    const display = (key: string) =>
      labels.get(key) ||
      key
        .split(/(\s+)/)
        .map((w) =>
          ACRONYMS.has(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)
        )
        .join("");
    const list = Array.from(counts.entries())
      .filter(([, n]) => n >= MIN_TAG_ESSAYS)
      .map(([key]) => key)
      .sort((a, b) => a.localeCompare(b));
    return {
      tags: list,
      tagLabels: new Map(list.map((k) => [k, display(k)] as const)),
    };
  }, [posts]);

  const hubSet = useMemo(
    () => new Set(hubTags.map((t) => topicHubSlug(t))),
    [hubTags]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (activeTag) {
        const pt = postTags(p);
        if (!pt.includes(activeTag.toLowerCase())) return false;
      }
      if (serverSearchActive || !q) return true;
      const hay =
        `${p.heading} ${p.subHeading} ${p.sbaTopicName} ${p.dek || ""} ${p.tags || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [posts, query, activeTag, serverSearchActive]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col gap-4'>
        <div>
          <label htmlFor='writing-search' className='sr-only'>
            Search writing
          </label>
          <form
            action='/writing'
            method='get'
            className='flex flex-col gap-2 sm:flex-row sm:items-center'
            onSubmit={() => setPage(1)}
          >
            <input
              id='writing-search'
              name='query'
              type='search'
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder='Search essays…'
              className='input-field min-h-11 w-full rounded-md bg-background px-3 py-2.5 text-sm'
            />
            <button
              type='submit'
              className='craft-cta-primary inline-flex h-11 min-h-11 shrink-0 items-center justify-center border-0 px-4 text-sm font-semibold'
            >
              Search
            </button>
          </form>
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
                      {
                        (t.subTopicList || []).filter(
                          (s) =>
                            (s.isPublished === true ||
                              s.isPublished === "true" ||
                              s.isPublished === "1") &&
                            isIndexable(s)
                        ).length
                      }
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
                  onClick={() => {
                    setActiveTag("");
                    setPage(1);
                  }}
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
                const hub = hubSet.has(topicHubSlug(tag));
                return (
                  <li key={tag}>
                    <Link
                      href={
                        hub
                          ? topicHubHref(tag)
                          : `/writing?tag=${encodeURIComponent(tag)}`
                      }
                      onClick={() => {
                        if (!hub) {
                          setActiveTag(tag);
                          setPage(1);
                        }
                      }}
                      className={[
                        "inline-flex min-h-9 items-center rounded-full border px-3 text-sm transition-colors",
                        active
                          ? "border-brand bg-brand/10 text-brand"
                          : "border-border text-muted-foreground hover:border-brand/40 hover:text-foreground",
                      ].join(" ")}
                    >
                      {tagLabels.get(tag) || tag}
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
              setPage(1);
            }}
          >
            Clear filters
          </button>
        </p>
      ) : (
        <>
          <ul className='m-0 flex list-none flex-col p-0'>
            {pageItems.map((post) => (
              <li key={post.id}>
                <EssayCard post={post} />
              </li>
            ))}
          </ul>
          {filtered.length > PAGE_SIZE ? (
            <nav
              aria-label='Writing pages'
              className='flex flex-wrap items-center justify-between gap-3 pt-2'
            >
              <button
                type='button'
                className='inline-flex min-h-11 items-center text-sm font-semibold text-brand underline-offset-4 hover:underline disabled:opacity-40'
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <p className='text-sm text-muted-foreground tabular-nums'>
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
        </>
      )}
    </div>
  );
}
