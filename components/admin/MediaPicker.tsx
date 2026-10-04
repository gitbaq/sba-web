"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/utils/AuthContext";
import { media_list_url, media_upload_url } from "@/utils/endpoints/endpoints";
import { readJson } from "@/lib/http";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export type MediaItem = {
  key: string;
  url: string;
  fileName: string;
  size: number;
  lastModified?: string | null;
};

type Props = {
  value?: string;
  onSelect: (url: string) => void;
  /**
   * Called when a library image is chosen or a new upload finishes.
   * Not called for manual URL typing (use Save for that).
   */
  onCommit?: (url: string) => void | Promise<void>;
  /** S3 prefix filter, e.g. about/ or uploads/ */
  defaultPrefix?: string;
  /** Folder for new uploads */
  uploadFolder?: string;
  label?: string;
  roundPreview?: boolean;
};

export default function MediaPicker({
  value,
  onSelect,
  onCommit,
  defaultPrefix = "",
  uploadFolder = "uploads",
  label = "Image",
  roundPreview = false,
}: Props) {
  const { token, handleUnauthorized } = useAuth();
  const [open, setOpen] = useState(false);
  const [prefix, setPrefix] = useState(defaultPrefix);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (opts?: { append?: boolean; tokenOverride?: string | null }) => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (prefix.trim()) params.set("prefix", prefix.trim());
        params.set("maxKeys", "48");
        if (opts?.tokenOverride) {
          params.set("continuationToken", opts.tokenOverride);
        }
        const res = await fetch(`${media_list_url}?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const body = await readJson<{ message?: string; detail?: string } | null>(
            res,
            null
          );
          if (res.status === 401) {
            handleUnauthorized();
            throw new Error("Session expired — sign in again on this host (localhost cookies are separate from production).");
          }
          throw new Error(
            body?.message ||
              body?.detail ||
              (res.status === 503
                ? "S3 is not configured"
                : "Could not list media")
          );
        }
        const data = await readJson<{
          items?: MediaItem[];
          truncated?: boolean;
          nextContinuationToken?: string;
        } | null>(res, null);
        const nextItems: MediaItem[] = Array.isArray(data?.items)
          ? data!.items!
          : [];
        setItems((prev) =>
          opts?.append ? [...prev, ...nextItems] : nextItems
        );
        setNextToken(
          data?.truncated && data.nextContinuationToken
            ? String(data.nextContinuationToken)
            : null
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not list media");
        if (!opts?.append) setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [token, prefix, handleUnauthorized]
  );

  useEffect(() => {
    if (!open) return;
    void load();
  }, [open, load]);

  async function upload(file: File) {
    if (!token) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be 10MB or smaller");
      return;
    }
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch(
        `${media_upload_url}?folder=${encodeURIComponent(uploadFolder)}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body,
        }
      );
      if (!res.ok) {
        const err = await readJson<{
          message?: string;
          detail?: string;
          errors?: string[];
        } | null>(res, null);
        throw new Error(
          err?.errors?.[0] || err?.message || err?.detail || "Upload failed"
        );
      }
      const data = await readJson<{
        url?: string;
        data?: { url?: string };
      } | null>(res, null);
      const url = data?.url || data?.data?.url;
      if (!url) throw new Error("No URL returned");
      onSelect(url);
      if (onCommit) await onCommit(url);
      else toast.success("Uploaded");
      setOpen(false);
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-start'>
        {value ? (
          <div
            className={`relative h-28 w-28 shrink-0 overflow-hidden bg-secondary ring-1 ring-border ${
              roundPreview ? "rounded-full" : "rounded-xl"
            }`}
          >
            <Image
              src={value}
              alt='Selected media'
              fill
              className='object-cover'
              sizes='112px'
              unoptimized={value.startsWith("http")}
            />
          </div>
        ) : (
          <div
            className={`flex h-28 w-28 shrink-0 items-center justify-center bg-secondary text-xs text-muted-foreground ring-1 ring-border ${
              roundPreview ? "rounded-full" : "rounded-xl"
            }`}
          >
            No image
          </div>
        )}
        <div className='flex-1 flex flex-col gap-3 min-w-0'>
          <div>
            <Label htmlFor={`media-url-${label}`}>{label} URL</Label>
            <Input
              id={`media-url-${label}`}
              value={value || ""}
              onChange={(e) => onSelect(e.target.value)}
              placeholder='https://… or /path.png'
            />
          </div>
          <div className='flex flex-wrap gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "Hide library" : "Choose from S3"}
            </Button>
            <label className='inline-flex cursor-pointer'>
              <span className='inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground'>
                {uploading ? "Uploading…" : "Upload new"}
              </span>
              <input
                type='file'
                accept='image/jpeg,image/png,image/webp,image/gif'
                className='sr-only'
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void upload(file);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {open && (
        <div className='rounded-xl border border-border bg-background/60 p-4 flex flex-col gap-3'>
          <div className='flex flex-col gap-2 sm:flex-row sm:items-end'>
            <div className='flex-1'>
              <Label htmlFor='media-prefix'>Folder prefix</Label>
              <Input
                id='media-prefix'
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder='about/ or leave empty for all'
              />
            </div>
            <Button
              type='button'
              variant='outline'
              disabled={loading}
              onClick={() => void load()}
            >
              Refresh
            </Button>
          </div>

          {error && (
            <p className='text-sm text-destructive'>{error}</p>
          )}

          {loading && items.length === 0 ? (
            <p className='text-sm text-muted-foreground'>Loading media…</p>
          ) : items.length === 0 ? (
            <p className='text-sm text-muted-foreground'>
              No images found for this prefix.
            </p>
          ) : (
            <ul className='m-0 grid list-none grid-cols-3 gap-2 p-0 sm:grid-cols-4 md:grid-cols-6'>
              {items.map((item) => {
                const selected = value === item.url;
                return (
                  <li key={item.key}>
                    <button
                      type='button'
                      title={item.key}
                      onClick={() => {
                        onSelect(item.url);
                        setOpen(false);
                        if (onCommit) void onCommit(item.url);
                        else toast.success("Image selected");
                      }}
                      className={`relative aspect-square w-full overflow-hidden rounded-lg bg-secondary ring-1 transition ${
                        selected
                          ? "ring-brand ring-2"
                          : "ring-border hover:ring-brand/50"
                      }`}
                    >
                      <Image
                        src={item.url}
                        alt={item.fileName}
                        fill
                        className='object-cover'
                        sizes='96px'
                        unoptimized
                      />
                    </button>
                    <p className='mt-1 truncate text-[10px] text-muted-foreground'>
                      {item.fileName}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}

          {nextToken && (
            <Button
              type='button'
              variant='outline'
              disabled={loading}
              onClick={() => void load({ append: true, tokenOverride: nextToken })}
            >
              Load more
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
