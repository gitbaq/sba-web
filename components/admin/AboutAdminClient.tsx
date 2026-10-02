"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/utils/AuthContext";
import {
  about_config_secure_url,
  media_upload_url,
} from "@/utils/endpoints/endpoints";
import { AboutConfig, Credential, FALLBACK_ABOUT } from "@/lib/work";
import { readJson } from "@/lib/http";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AboutAdminClient() {
  const { token, isAdmin } = useAuth();
  const [form, setForm] = useState<AboutConfig>(FALLBACK_ABOUT);
  const [credText, setCredText] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(about_config_secure_url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("load failed");
      const data = await readJson<AboutConfig | null>(res, null);
      if (!data) throw new Error("load failed");
      const next: AboutConfig = {
        displayName: data.displayName || FALLBACK_ABOUT.displayName,
        title: data.title || FALLBACK_ABOUT.title,
        bio: data.bio || FALLBACK_ABOUT.bio,
        photoUrl: data.photoUrl || FALLBACK_ABOUT.photoUrl,
        hiringBlurb: data.hiringBlurb || FALLBACK_ABOUT.hiringBlurb,
        homeBlurb: data.homeBlurb || FALLBACK_ABOUT.homeBlurb,
        credentials: Array.isArray(data.credentials)
          ? data.credentials
          : FALLBACK_ABOUT.credentials,
      };
      setForm(next);
      setCredText(
        next.credentials
          .map((c) => (c.href ? `${c.label} | ${c.href}` : c.label))
          .join("\n")
      );
    } catch {
      toast.error("Could not load about config");
    } finally {
      setReady(true);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  function parseCredentials(text: string): Credential[] {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, href] = line.split("|").map((s) => s.trim());
        return href ? { label, href } : { label };
      });
  }

  async function uploadPhoto(file: File) {
    if (!token) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch(`${media_upload_url}?folder=about`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      if (!res.ok) {
        const err = await readJson<{ message?: string; detail?: string } | null>(
          res,
          null
        );
        throw new Error(err?.message || err?.detail || "Upload failed");
      }
      const data = await readJson<{ url?: string } | null>(res, null);
      if (!data?.url) throw new Error("No URL returned");
      setForm((prev) => ({ ...prev, photoUrl: data.url! }));
      toast.success("Photo uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(about_config_secure_url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          credentials: parseCredentials(credText),
        }),
      });
      if (!res.ok) {
        const err = await readJson<{ message?: string; detail?: string } | null>(
          res,
          null
        );
        throw new Error(err?.message || err?.detail || "Save failed");
      }
      try {
        await fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paths: ["/", "/about"],
            tag: "about-config",
          }),
        });
      } catch {
        /* best-effort */
      }
      toast.success("About page updated");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setLoading(false);
    }
  }

  if (!token || !isAdmin) {
    return (
      <p className='text-muted-foreground'>
        <Link
          href='/login'
          className='text-brand underline-offset-4 hover:underline'
        >
          Sign in
        </Link>{" "}
        as admin to manage About.
      </p>
    );
  }

  if (!ready) {
    return <p className='text-sm text-muted-foreground'>Loading…</p>;
  }

  return (
    <div className='flex flex-col gap-8'>
      <section className='rounded-xl border border-border bg-card p-5 flex flex-col gap-4'>
        <h2 className='font-display text-lg font-semibold'>Photo</h2>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-start'>
          <div className='relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-secondary ring-1 ring-border'>
            <Image
              src={form.photoUrl || FALLBACK_ABOUT.photoUrl}
              alt='About photo preview'
              fill
              className='object-cover'
              sizes='112px'
              unoptimized={form.photoUrl?.startsWith("http")}
            />
          </div>
          <div className='flex-1 flex flex-col gap-3'>
            <div>
              <Label htmlFor='photo-url'>Photo URL</Label>
              <Input
                id='photo-url'
                value={form.photoUrl}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, photoUrl: e.target.value }))
                }
                placeholder='/sba-photo-2-small.png'
              />
            </div>
            <div>
              <Label htmlFor='photo-file'>Or upload image</Label>
              <Input
                id='photo-file'
                type='file'
                accept='image/jpeg,image/png,image/webp,image/gif'
                disabled={uploading || loading}
                className='mt-1 cursor-pointer'
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void uploadPhoto(file);
                }}
              />
              <p className='mt-1 text-xs text-muted-foreground'>
                Uploads to S3 when configured. Otherwise paste a public URL.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='rounded-xl border border-border bg-card p-5 flex flex-col gap-4'>
        <h2 className='font-display text-lg font-semibold'>Profile copy</h2>
        <div className='grid gap-3 sm:grid-cols-2'>
          <div>
            <Label htmlFor='display-name'>Display name</Label>
            <Input
              id='display-name'
              value={form.displayName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, displayName: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor='about-title'>Title / role line</Label>
            <Input
              id='about-title'
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>
          <div className='sm:col-span-2'>
            <Label htmlFor='bio'>About bio</Label>
            <textarea
              id='bio'
              className='mt-1 w-full min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm'
              value={form.bio}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, bio: e.target.value }))
              }
            />
          </div>
          <div className='sm:col-span-2'>
            <Label htmlFor='home-blurb'>Home page about blurb</Label>
            <textarea
              id='home-blurb'
              className='mt-1 w-full min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm'
              value={form.homeBlurb}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, homeBlurb: e.target.value }))
              }
            />
          </div>
          <div className='sm:col-span-2'>
            <Label htmlFor='hiring-blurb'>Hiring section blurb</Label>
            <textarea
              id='hiring-blurb'
              className='mt-1 w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm'
              value={form.hiringBlurb}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, hiringBlurb: e.target.value }))
              }
            />
          </div>
        </div>
      </section>

      <section className='rounded-xl border border-border bg-card p-5 flex flex-col gap-4'>
        <div>
          <h2 className='font-display text-lg font-semibold'>Credentials</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            One per line. Optional link:{" "}
            <code className='text-xs'>Label | https://…</code>
          </p>
        </div>
        <textarea
          className='w-full min-h-40 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono'
          value={credText}
          onChange={(e) => setCredText(e.target.value)}
        />
      </section>

      <div className='flex flex-wrap gap-3'>
        <Button type='button' onClick={() => void save()} disabled={loading}>
          {loading ? "Saving…" : "Save about"}
        </Button>
        <Button type='button' variant='outline' asChild>
          <Link href='/about' target='_blank' rel='noopener noreferrer'>
            Preview About
          </Link>
        </Button>
      </div>
    </div>
  );
}
