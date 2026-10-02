"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { SubTopic } from "@/types/types";
import { useAuth } from "@/utils/AuthContext";
import {
  newsletter_send_url,
  subtopics_url,
} from "@/utils/endpoints/endpoints";
import { isIndexable } from "@/lib/articles";
import { readJson } from "@/lib/http";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type SendResult = {
  essayId?: number;
  title?: string;
  essayUrl?: string;
  confirmedCount?: number;
  dryRun?: boolean;
  wouldSend?: number;
  sent?: number;
  failed?: number;
  message?: string;
  emailEnabled?: boolean;
  error?: string;
};

export default function NewsletterAdminClient() {
  const { token, isAdmin } = useAuth();
  const [essays, setEssays] = useState<SubTopic[]>([]);
  const [essayId, setEssayId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<SendResult | null>(null);

  const loadEssays = useCallback(async () => {
    try {
      const res = await fetch(subtopics_url);
      if (!res.ok) throw new Error("load failed");
      const data = await readJson<SubTopic[]>(res, []);
      const published = (Array.isArray(data) ? data : [])
        .filter(
          (p) =>
            (p.isPublished === true ||
              p.isPublished === "true" ||
              p.isPublished === "1") &&
            isIndexable(p)
        )
        .sort((a, b) => {
          const at = Date.parse(a.publishDate || a.updateDate || "") || 0;
          const bt = Date.parse(b.publishDate || b.updateDate || "") || 0;
          return bt - at;
        });
      setEssays(published);
      setEssayId((current) =>
        current === "" && published.length ? published[0].id : current
      );
    } catch {
      toast.error("Could not load essays");
    }
  }, []);

  useEffect(() => {
    void loadEssays();
  }, [loadEssays]);

  async function runSend(dryRun: boolean) {
    if (!token || essayId === "") {
      toast.error("Sign in and pick an essay");
      return;
    }
    if (!dryRun) {
      const ok = window.confirm(
        "Send this essay to all confirmed subscribers? This cannot be undone."
      );
      if (!ok) return;
    }
    setLoading(true);
    setLastResult(null);
    try {
      const res = await fetch(newsletter_send_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          essayId: Number(essayId),
          dryRun,
        }),
      });
      const data = (await readJson<SendResult>(res, {})) as SendResult;
      if (!res.ok) {
        toast.error(data.error || "Send failed");
        setLastResult(data);
        return;
      }
      setLastResult(data);
      toast.success(data.message || (dryRun ? "Dry run done" : "Send done"));
    } catch {
      toast.error("Request failed");
    } finally {
      setLoading(false);
    }
  }

  if (!isAdmin) {
    return (
      <p className='text-muted-foreground'>
        Admin sign-in required.{" "}
        <Link href='/login' className='text-brand underline-offset-4 hover:underline'>
          Login
        </Link>
      </p>
    );
  }

  return (
    <div className='flex flex-col gap-8'>
      <section className='flex flex-col gap-4 max-w-xl'>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='essay'>Published essay</Label>
          <select
            id='essay'
            className='input-field min-h-11 rounded-md bg-background px-3 text-sm'
            value={essayId === "" ? "" : String(essayId)}
            onChange={(e) =>
              setEssayId(e.target.value ? Number(e.target.value) : "")
            }
          >
            <option value=''>Select…</option>
            {essays.map((e) => (
              <option key={e.id} value={e.id}>
                {e.subHeading || e.heading} (#{e.id})
              </option>
            ))}
          </select>
        </div>
        <p className='text-sm text-muted-foreground leading-relaxed'>
          Dry run shows how many confirmed subscribers would get the email. Send
          emails the essay title, dek, and link. Requires SES production access
          for addresses that are not verified identities.
        </p>
        <div className='flex flex-wrap gap-2'>
          <Button
            type='button'
            variant='outline'
            disabled={loading || essayId === ""}
            onClick={() => void runSend(true)}
          >
            Dry run
          </Button>
          <Button
            type='button'
            disabled={loading || essayId === ""}
            onClick={() => void runSend(false)}
          >
            {loading ? "Working…" : "Send to confirmed"}
          </Button>
        </div>
      </section>

      {lastResult && (
        <section className='rounded-lg border border-border bg-secondary/30 p-4 text-sm max-w-xl'>
          <p className='font-semibold mb-2'>Last result</p>
          <ul className='m-0 list-none space-y-1 p-0 text-muted-foreground'>
            {lastResult.title && (
              <li>
                Essay: <span className='text-foreground'>{lastResult.title}</span>
              </li>
            )}
            {lastResult.essayUrl && (
              <li>
                URL:{" "}
                <a
                  href={lastResult.essayUrl}
                  className='text-brand underline-offset-4 hover:underline'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {lastResult.essayUrl}
                </a>
              </li>
            )}
            {typeof lastResult.confirmedCount === "number" && (
              <li>Confirmed subscribers: {lastResult.confirmedCount}</li>
            )}
            {typeof lastResult.wouldSend === "number" && (
              <li>Would send: {lastResult.wouldSend}</li>
            )}
            {typeof lastResult.sent === "number" && (
              <li>Sent: {lastResult.sent}</li>
            )}
            {typeof lastResult.failed === "number" && (
              <li>Failed: {lastResult.failed}</li>
            )}
            {typeof lastResult.emailEnabled === "boolean" && (
              <li>SES enabled: {lastResult.emailEnabled ? "yes" : "no"}</li>
            )}
            {lastResult.message && <li>{lastResult.message}</li>}
            {lastResult.error && (
              <li className='text-destructive'>{lastResult.error}</li>
            )}
          </ul>
        </section>
      )}
    </div>
  );
}
