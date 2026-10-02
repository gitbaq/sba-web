"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SubTopic } from "@/types/types";
import { subtopics_url } from "@/utils/endpoints/endpoints";
import { articleHref } from "@/lib/articles";
import { readJson } from "@/lib/http";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function isPublishedFlag(flag: unknown): boolean {
  return flag === true || flag === "true" || flag === "1";
}

function dayStartMs(isoDate: string): number | null {
  if (!isoDate) return null;
  const t = Date.parse(`${isoDate}T00:00:00`);
  return Number.isFinite(t) ? t : null;
}

function dayEndMs(isoDate: string): number | null {
  if (!isoDate) return null;
  const t = Date.parse(`${isoDate}T23:59:59.999`);
  return Number.isFinite(t) ? t : null;
}

type StatusFilter = "all" | "published" | "draft";

export default function EssaysAdminClient() {
  const [essays, setEssays] = useState<SubTopic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [publishedFrom, setPublishedFrom] = useState("");
  const [publishedTo, setPublishedTo] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(subtopics_url);
        if (!res.ok) throw new Error("load failed");
        const data = await readJson<SubTopic[]>(res, []);
        if (cancelled) return;
        const list = (Array.isArray(data) ? data : []).sort((a, b) => {
          const at = Date.parse(a.publishDate || a.updateDate || "") || 0;
          const bt = Date.parse(b.publishDate || b.updateDate || "") || 0;
          return bt - at;
        });
        setEssays(list);
      } catch {
        if (!cancelled) setError("Could not load essays");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const fromMs = dayStartMs(publishedFrom);
    const toMs = dayEndMs(publishedTo);

    return essays.filter((essay) => {
      const published = isPublishedFlag(essay.isPublished);

      if (status === "published" && !published) return false;
      if (status === "draft" && published) return false;

      if (fromMs != null || toMs != null) {
        const pubMs = Date.parse(essay.publishDate || "") || NaN;
        if (!Number.isFinite(pubMs)) return false;
        if (fromMs != null && pubMs < fromMs) return false;
        if (toMs != null && pubMs > toMs) return false;
      }

      if (!q) return true;
      const hay = [
        essay.heading,
        essay.subHeading,
        essay.dek,
        essay.slug,
        essay.content,
        essay.sbaTopicName,
        essay.tags,
      ]
        .filter(Boolean)
        .join("\n")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [essays, query, status, publishedFrom, publishedTo]);

  if (loading) {
    return <p className='text-sm text-muted-foreground'>Loading essays…</p>;
  }

  if (error) {
    return <p className='text-sm text-destructive'>{error}</p>;
  }

  return (
    <div className='flex flex-col gap-6'>
      <section
        aria-label='Filter essays'
        className='rounded-xl border border-border bg-card p-4 flex flex-col gap-4'
      >
        <div>
          <Label htmlFor='essay-search'>Search</Label>
          <Input
            id='essay-search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Title, subtitle, body, slug…'
            className='mt-1'
          />
        </div>
        <div className='grid gap-4 sm:grid-cols-3'>
          <div>
            <Label htmlFor='essay-status'>Status</Label>
            <select
              id='essay-status'
              className='mt-1 w-full min-h-11 rounded-md border border-input bg-background px-3 text-sm'
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
            >
              <option value='all'>All</option>
              <option value='published'>Published</option>
              <option value='draft'>Draft</option>
            </select>
          </div>
          <div>
            <Label htmlFor='pub-from'>Published from</Label>
            <Input
              id='pub-from'
              type='date'
              className='mt-1'
              value={publishedFrom}
              onChange={(e) => setPublishedFrom(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor='pub-to'>Published to</Label>
            <Input
              id='pub-to'
              type='date'
              className='mt-1'
              value={publishedTo}
              onChange={(e) => setPublishedTo(e.target.value)}
            />
          </div>
        </div>
        <p className='text-xs text-muted-foreground'>
          Showing {filtered.length} of {essays.length} essays
          {query || status !== "all" || publishedFrom || publishedTo
            ? " (filtered)"
            : ""}
          .
        </p>
      </section>

      {essays.length === 0 ? (
        <p className='text-sm text-muted-foreground'>No essays found.</p>
      ) : filtered.length === 0 ? (
        <p className='text-sm text-muted-foreground'>
          No essays match these filters.
        </p>
      ) : (
        <ul className='m-0 divide-y divide-border rounded-xl border border-border bg-card p-0 list-none'>
          {filtered.map((essay) => {
            const published = isPublishedFlag(essay.isPublished);
            const title =
              essay.subHeading || essay.heading || `Essay ${essay.id}`;
            const pubLabel = essay.publishDate
              ? new Date(essay.publishDate).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : null;
            return (
              <li
                key={essay.id}
                className='flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between'
              >
                <div className='min-w-0'>
                  <p className='font-medium text-foreground truncate'>{title}</p>
                  <p className='text-xs text-muted-foreground mt-0.5'>
                    #{essay.id}
                    {essay.slug ? ` · ${essay.slug}` : ""}
                    {essay.sbaTopicName ? ` · ${essay.sbaTopicName}` : ""}
                    {" · "}
                    <span
                      className={
                        published
                          ? "text-foreground"
                          : "text-amber-700 dark:text-amber-400"
                      }
                    >
                      {published ? "Published" : "Draft"}
                    </span>
                    {pubLabel ? ` · ${pubLabel}` : ""}
                  </p>
                </div>
                <div className='flex flex-wrap gap-3 shrink-0 text-sm'>
                  <Link
                    href={`/editor/${essay.id}`}
                    className='text-brand underline-offset-4 hover:underline font-medium'
                  >
                    Edit
                  </Link>
                  {published ? (
                    <Link
                      href={articleHref(essay)}
                      className='text-muted-foreground underline-offset-4 hover:underline hover:text-foreground'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      View
                    </Link>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
