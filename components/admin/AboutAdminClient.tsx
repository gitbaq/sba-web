"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/utils/AuthContext";
import { about_config_secure_url } from "@/utils/endpoints/endpoints";
import { AboutConfig, Credential, EMPTY_ABOUT } from "@/lib/work";
import { readJson } from "@/lib/http";
import MediaPicker from "@/components/admin/MediaPicker";
import { useConfirm } from "@/components/admin/ConfirmProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { errorMessage, fromApiBody } from "@/lib/adminErrors";
import { toast } from "sonner";

export default function AboutAdminClient() {
  const { token, isAdmin } = useAuth();
  const confirm = useConfirm();
  const [form, setForm] = useState<AboutConfig>(EMPTY_ABOUT);
  const [credText, setCredText] = useState("");
  const [loading, setLoading] = useState(false);
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
        displayName: data.displayName || "",
        title: data.title || "",
        bio: data.bio || "",
        photoUrl: data.photoUrl || "",
        hiringBlurb: data.hiringBlurb || "",
        homeBlurb: data.homeBlurb || "",
        credentials: Array.isArray(data.credentials) ? data.credentials : [],
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

  async function persistAbout(next: AboutConfig, successMessage: string) {
    if (!token) return;
    const res = await fetch(about_config_secure_url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...next,
        credentials: parseCredentials(credText),
      }),
    });
    if (!res.ok) {
      const err = await readJson<{
        message?: string;
        detail?: string;
        errors?: string[];
      } | null>(res, null);
      throw new Error(fromApiBody(err, "Save failed"));
    }
    try {
      const rev = await fetch("/api/admin/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paths: ["/", "/about", "/work-with-me"],
          tag: "about-config",
        }),
      });
      if (!rev.ok) {
        toast.error("Saved, but cache revalidate failed. Refresh may lag.");
      }
    } catch {
      toast.error("Saved, but cache revalidate failed. Refresh may lag.");
    }
    toast.success(successMessage);
    await load();
  }

  async function commitPhoto(url: string) {
    const ok = await confirm({
      title: "Save this photo?",
      description: "This updates the About photo on the live site.",
      confirmLabel: "Save photo",
    });
    if (!ok) return;
    const next = { ...form, photoUrl: url };
    setForm(next);
    setLoading(true);
    try {
      await persistAbout(next, "Photo saved");
    } catch (e) {
      toast.error(errorMessage(e, "Could not save photo"));
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!token) return;
    const ok = await confirm({
      title: "Save About page?",
      description: "This publishes photo, bio, and credentials changes.",
      confirmLabel: "Save",
    });
    if (!ok) return;
    setLoading(true);
    try {
      await persistAbout(form, "About page updated");
    } catch (e) {
      toast.error(errorMessage(e, "Could not save"));
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
        <MediaPicker
          label='Photo'
          value={form.photoUrl}
          roundPreview
          defaultPrefix='about/'
          uploadFolder='about'
          onSelect={(url) =>
            setForm((prev) => ({ ...prev, photoUrl: url }))
          }
          onCommit={(url) => commitPhoto(url)}
        />
        <p className='text-xs text-muted-foreground'>
          Choose from S3 (defaults to the about/ folder; clear the prefix to
          browse all), upload a new image, or paste a URL and click Save.
        </p>
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
