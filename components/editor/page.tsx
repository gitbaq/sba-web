"use client";

import { SubTopic, Topic } from "@/types/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/utils/AuthContext";
import {
  subtopics_secure_url,
  topics_secure_url,
} from "@/utils/endpoints/endpoints";
import { toast } from "sonner";
import Link from "next/link";
import FreeRichTextEditor, {
  type FreeRichTextEditorHandle,
} from "@/components/editor/FreeRichTextEditor";
import { Switch } from "@/components/ui/switch";
import { articleHref } from "@/lib/articles";
import { readJson } from "@/lib/http";
import MediaPicker from "@/components/admin/MediaPicker";
import { useConfirm } from "@/components/admin/ConfirmProvider";

type Params = { subId: string | undefined; post: SubTopic };

type FormState = {
  id: number;
  topicId: number;
  publishDate: string;
  publishedBy: string;
  createdBy: string;
  updatedBy: string;
  isPublished: boolean;
  heading: string;
  subHeading: string;
  slug: string;
  imageUrl: string;
  content: string;
  dek: string;
  tldr: string;
  tags: string;
  seriesOrder: number | "";
  noindex: boolean;
};

function toForm(post?: SubTopic): FormState {
  return {
    id: post?.id || 0,
    topicId: Number(post?.topicId) || 0,
    publishDate: post?.publishDate ? toLocalInput(post.publishDate) : "",
    publishedBy: post?.publishedBy || "",
    createdBy: post?.createdBy || "",
    updatedBy: post?.updatedBy || "",
    isPublished: Boolean(post?.isPublished),
    heading: post?.heading || "",
    subHeading: post?.subHeading || "",
    slug: post?.slug || "",
    imageUrl: post?.imageUrl || "",
    content: post?.content || "",
    dek: post?.dek || "",
    tldr: post?.tldr || "",
    tags: post?.tags || "",
    seriesOrder:
      post?.seriesOrder === undefined || post?.seriesOrder === null
        ? ""
        : Number(post.seriesOrder),
    noindex: Boolean(post?.noindex),
  };
}

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(local: string): string | null {
  if (!local) return null;
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function statusLabel(form: FormState): string {
  if (form.isPublished) return "Published";
  if (form.publishDate) {
    const when = new Date(form.publishDate);
    if (!Number.isNaN(when.getTime()) && when.getTime() > Date.now()) {
      return "Scheduled";
    }
  }
  return "Draft";
}

export default function XEditor({ params }: { params?: Params }) {
  const post = params?.post;
  const { token, isAdmin, isAuthenticated } = useAuth();
  const confirm = useConfirm();
  const [formData, setFormData] = useState<FormState>(() => toForm(post));
  const [series, setSeries] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const editorRef = useRef<FreeRichTextEditorHandle>(null);

  useEffect(() => {
    if (!token || !isAdmin) return;
    fetch(topics_secure_url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? readJson<Topic[]>(r, []) : []))
      .then((data) => setSeries(Array.isArray(data) ? data : []))
      .catch(() => setSeries([]));
  }, [token, isAdmin]);

  const status = useMemo(() => statusLabel(formData), [formData]);

  if (isAuthenticated && !isAdmin) {
    return (
      <div className='p-8 max-w-lg'>
        <p className='text-muted-foreground'>
          Editor access is limited to admin accounts.
        </p>
        <Link href='/writing' className='text-brand underline-offset-4 hover:underline'>
          Back to writing
        </Link>
      </div>
    );
  }

  async function save(
    patch?: Partial<FormState>,
    options?: { skipConfirm?: boolean; confirmTitle?: string; confirmDescription?: string }
  ) {
    if (!token || !isAdmin) {
      toast.error("Admin sign-in required to save.");
      return;
    }
    if (!formData.id) {
      toast.error("Missing essay id.");
      return;
    }
    if (!options?.skipConfirm) {
      const ok = await confirm({
        title: options?.confirmTitle || "Save this essay?",
        description:
          options?.confirmDescription ||
          "This updates the essay in the database and may change the live site.",
        confirmLabel: "Save",
      });
      if (!ok) return;
    }
    const liveHtml = editorRef.current?.getHTML();
    const next = {
      ...formData,
      ...patch,
      content: liveHtml || formData.content,
    };
    setIsLoading(true);
    try {
      const body = {
        id: next.id,
        topicId: Number(next.topicId) || 0,
        heading: next.heading,
        subHeading: next.subHeading,
        slug: next.slug,
        imageUrl: next.imageUrl || null,
        content: next.content,
        isPublished: next.isPublished,
        publishDate: fromLocalInput(next.publishDate),
        publishedBy: next.publishedBy || null,
        dek: next.dek || null,
        tldr: next.tldr || null,
        tags: next.tags || null,
        seriesOrder:
          next.seriesOrder === "" ? null : Number(next.seriesOrder),
        noindex: next.noindex,
        createdBy: next.createdBy || null,
        updateBy: next.updatedBy || null,
      };

      const response = await fetch(subtopics_secure_url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        toast.error("Failed to update essay");
        return;
      }
      setFormData(next);

      const path = articleHref({
        id: next.id,
        slug: next.slug,
        subHeading: next.subHeading,
        heading: next.heading,
      });
      try {
        await fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tag: "essays",
            paths: [path, "/writing", "/writing/series", "/"],
          }),
        });
      } catch {
        /* cache bust is best-effort */
      }

      toast.success("Essay saved");
      // Soft-nav refresh of RSC payloads so Back does not restore a stale shell.
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("sba:essays-updated"));
      }
    } catch (error) {
      toast.error("Error updating essay");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function publishNow() {
    const now = toLocalInput(new Date().toISOString());
    void save(
      { isPublished: true, publishDate: now },
      {
        confirmTitle: "Publish this essay now?",
        confirmDescription:
          "The essay will go live. Subscribers are not emailed until you send from Newsletter.",
      }
    );
  }

  function unpublish() {
    void save(
      { isPublished: false },
      {
        confirmTitle: "Unpublish this essay?",
        confirmDescription: "The essay will leave the public writing index.",
      }
    );
  }

  function saveDraft() {
    void save(
      { isPublished: false },
      {
        confirmTitle: "Save as draft?",
        confirmDescription: "Keep the essay unpublished and save current edits.",
      }
    );
  }

  function schedule() {
    if (!formData.publishDate) {
      toast.error("Pick a publish date and time first.");
      return;
    }
    const when = new Date(formData.publishDate);
    if (Number.isNaN(when.getTime()) || when.getTime() <= Date.now()) {
      toast.error("Schedule time must be in the future.");
      return;
    }
    void save(
      { isPublished: false },
      {
        confirmTitle: "Schedule this essay?",
        confirmDescription: `Save with publish time ${formData.publishDate}. It stays unpublished until you publish.`,
      }
    );
  }

  function previewHref(): string {
    return articleHref({
      id: formData.id,
      slug: formData.slug,
      subHeading: formData.subHeading,
      heading: formData.heading,
    });
  }

  function openPreview() {
    const path = previewHref();
    // Cache-bust query so back/forward and CDN do not show a stale shell.
    const url = `${path}?preview=${Date.now()}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className='flex flex-col gap-4 p-4 pb-8'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <p className='accent-label mb-1'>Editor</p>
          <h1 className='font-display text-2xl font-semibold tracking-tight'>
            {formData.heading || "Untitled essay"}
          </h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Status: <span className='font-medium text-foreground'>{status}</span>
            {" · "}
            <Link
              href='/admin/essays'
              className='text-brand underline-offset-4 hover:underline'
            >
              Manage essays
            </Link>
            {" · "}
            <Link
              href='/admin/series'
              className='text-brand underline-offset-4 hover:underline'
            >
              Manage series
            </Link>
          </p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={openPreview}
            disabled={!formData.slug && !formData.id}
          >
            Preview
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={saveDraft}
            disabled={isLoading}
          >
            Save draft
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={schedule}
            disabled={isLoading}
          >
            Schedule
          </Button>
          {formData.isPublished ? (
            <Button
              type='button'
              variant='outline'
              onClick={unpublish}
              disabled={isLoading}
            >
              Unpublish
            </Button>
          ) : (
            <Button type='button' onClick={publishNow} disabled={isLoading}>
              Publish now
            </Button>
          )}
          <Button type='button' onClick={() => save()} disabled={isLoading}>
            {isLoading ? "Saving…" : "Save"}
          </Button>
        </div>
        <p className='text-sm text-muted-foreground'>
          Save and Publish only update the site. They do not email subscribers.
          Send from Admin → Newsletter when ready.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-border bg-card p-5'>
        <div>
          <Label htmlFor='heading'>Heading</Label>
          <Input
            id='heading'
            value={formData.heading}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, heading: e.target.value }))
            }
            placeholder='Enter heading'
          />
        </div>
        <div>
          <Label htmlFor='slug'>Slug</Label>
          <Input
            id='slug'
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slug: e.target.value }))
            }
            placeholder='canonical-slug'
          />
        </div>
        <div className='md:col-span-2'>
          <Label htmlFor='subHeading'>Title (H1)</Label>
          <Input
            id='subHeading'
            value={formData.subHeading}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, subHeading: e.target.value }))
            }
            placeholder='Public title'
          />
        </div>
        <div className='md:col-span-2'>
          <Label htmlFor='dek'>Dek (one sentence)</Label>
          <Input
            id='dek'
            value={formData.dek}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dek: e.target.value }))
            }
            placeholder='Card and meta summary'
          />
        </div>
        <div className='md:col-span-2'>
          <Label htmlFor='tldr'>TL;DR</Label>
          <Input
            id='tldr'
            value={formData.tldr}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, tldr: e.target.value }))
            }
            placeholder='Two-line takeaway'
          />
        </div>
        <div>
          <Label htmlFor='series'>Series</Label>
          <select
            id='series'
            className='input-field mt-1 w-full min-h-11 rounded-md bg-background px-3 text-sm'
            value={formData.topicId || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                topicId: Number(e.target.value) || 0,
              }))
            }
          >
            <option value=''>No series</option>
            {series.map((t) => (
              <option key={t.id} value={t.id}>
                {t.sbaTopicName}
                {t.isPublished === false ? " (unpublished)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor='seriesOrder'>Series order</Label>
          <Input
            id='seriesOrder'
            type='number'
            value={formData.seriesOrder}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                seriesOrder:
                  e.target.value === "" ? "" : Number(e.target.value),
              }))
            }
            placeholder='1'
          />
        </div>
        <div>
          <Label htmlFor='publishDate'>Publish / schedule time</Label>
          <Input
            id='publishDate'
            type='datetime-local'
            value={formData.publishDate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                publishDate: e.target.value,
              }))
            }
          />
          <p className='mt-1 text-xs text-muted-foreground'>
            For schedule: set a future time, leave unpublished, then Schedule.
          </p>
        </div>
        <div>
          <Label htmlFor='tags'>Tags (comma-separated)</Label>
          <Input
            id='tags'
            value={formData.tags}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, tags: e.target.value }))
            }
            placeholder='ai,nlp'
          />
        </div>
        <div className='md:col-span-2'>
          <MediaPicker
            label='Cover image'
            value={formData.imageUrl || ""}
            onSelect={(url) =>
              setFormData((prev) => ({ ...prev, imageUrl: url }))
            }
            defaultPrefix=''
            uploadFolder='essays'
          />
        </div>
        <div className='flex items-center gap-3 md:col-span-2'>
          <Switch
            id='noindex'
            checked={formData.noindex}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, noindex: checked }))
            }
          />
          <Label htmlFor='noindex'>noindex (hide from sitemap / search)</Label>
        </div>
      </div>

      <div className='flex-1 min-h-[32rem]'>
        <Label className='mb-2 block'>Content</Label>
        <FreeRichTextEditor
          ref={editorRef}
          value={formData.content}
          onChange={(html) =>
            setFormData((prev) => ({ ...prev, content: html }))
          }
        />
      </div>
    </div>
  );
}
