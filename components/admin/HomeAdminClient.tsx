"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SubTopic } from "@/types/types";
import { useAuth } from "@/utils/AuthContext";
import {
  home_config_secure_url,
  subtopics_url,
} from "@/utils/endpoints/endpoints";
import { DEFAULT_START_HERE_IDS } from "@/lib/homeConfig";
import { readJson } from "@/lib/http";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function isPublishedFlag(flag: unknown): boolean {
  return flag === true || flag === "true" || flag === "1";
}

function essayLabel(essay: SubTopic): string {
  return essay.subHeading || essay.heading || `Essay ${essay.id}`;
}

export default function HomeAdminClient() {
  const { token, isAdmin } = useAuth();
  const [essays, setEssays] = useState<SubTopic[]>([]);
  const [featuredEssayId, setFeaturedEssayId] = useState<number | "">("");
  const [startHereIds, setStartHereIds] = useState<(number | "")[]>(["", "", ""]);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const published = useMemo(
    () =>
      essays
        .filter((e) => isPublishedFlag(e.isPublished))
        .sort((a, b) =>
          essayLabel(a).localeCompare(essayLabel(b), undefined, {
            sensitivity: "base",
          })
        ),
    [essays]
  );

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const [essaysRes, configRes] = await Promise.all([
        fetch(subtopics_url),
        fetch(home_config_secure_url, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (!essaysRes.ok) throw new Error("essays");
      const essayData = await readJson<SubTopic[]>(essaysRes, []);
      setEssays(Array.isArray(essayData) ? essayData : []);

      if (configRes.ok) {
        const cfg = await readJson<{
          featuredEssayId?: number | null;
          startHereEssayIds?: unknown[];
        } | null>(configRes, null);
        if (!cfg) {
          setStartHereIds([
            DEFAULT_START_HERE_IDS[0],
            DEFAULT_START_HERE_IDS[1],
            DEFAULT_START_HERE_IDS[2],
          ]);
        } else {
          setFeaturedEssayId(
            cfg.featuredEssayId != null && Number(cfg.featuredEssayId) > 0
              ? Number(cfg.featuredEssayId)
              : ""
          );
          const ids = Array.isArray(cfg.startHereEssayIds)
            ? cfg.startHereEssayIds.map((n: unknown) => Number(n)).filter(Boolean)
            : [...DEFAULT_START_HERE_IDS];
          setStartHereIds([ids[0] || "", ids[1] || "", ids[2] || ""]);
        }
      } else {
        setStartHereIds([
          DEFAULT_START_HERE_IDS[0],
          DEFAULT_START_HERE_IDS[1],
          DEFAULT_START_HERE_IDS[2],
        ]);
      }
    } catch {
      toast.error("Could not load homepage config");
    } finally {
      setReady(true);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  function setSlot(index: number, value: number | "") {
    setStartHereIds((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function moveSlot(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target > 2) return;
    setStartHereIds((prev) => {
      const next = [...prev];
      const tmp = next[index];
      next[index] = next[target];
      next[target] = tmp;
      return next;
    });
  }

  async function save() {
    if (!token) return;
    const ids = startHereIds
      .map((id) => (id === "" ? null : Number(id)))
      .filter((id): id is number => id != null && id > 0);
    const unique = [...new Set(ids)].slice(0, 3);
    if (unique.length === 0) {
      toast.error("Pick at least one Start here essay");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(home_config_secure_url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          featuredEssayId:
            featuredEssayId === "" ? null : Number(featuredEssayId),
          startHereEssayIds: unique,
        }),
      });
      if (!res.ok) {
        const body = await readJson<{ message?: string; detail?: string } | null>(
          res,
          null
        );
        throw new Error(body?.message || body?.detail || "save failed");
      }
      try {
        await fetch("/api/admin/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paths: ["/"], tag: "home-config" }),
        });
      } catch {
        /* best-effort */
      }
      toast.success("Homepage updated");
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
        as admin to manage the homepage.
      </p>
    );
  }

  if (!ready) {
    return <p className='text-sm text-muted-foreground'>Loading…</p>;
  }

  return (
    <div className='flex flex-col gap-8'>
      <section className='rounded-xl border border-border bg-card p-5 flex flex-col gap-4'>
        <div>
          <h2 className='font-display text-lg font-semibold'>Featured boost</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            Pin one published essay as the large card under Latest essays. Leave
            empty to use the newest essay.
          </p>
        </div>
        <div>
          <Label htmlFor='featured-essay'>Boosted essay</Label>
          <select
            id='featured-essay'
            className='mt-1 w-full min-h-11 rounded-md border border-input bg-background px-3 text-sm'
            value={featuredEssayId === "" ? "" : String(featuredEssayId)}
            onChange={(e) =>
              setFeaturedEssayId(
                e.target.value ? Number(e.target.value) : ""
              )
            }
          >
            <option value=''>Newest (no boost)</option>
            {published.map((e) => (
              <option key={e.id} value={e.id}>
                {essayLabel(e)}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className='rounded-xl border border-border bg-card p-5 flex flex-col gap-4'>
        <div>
          <h2 className='font-display text-lg font-semibold'>Start here</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            Choose up to three essays for “Three places to begin”, in order.
          </p>
        </div>
        <ul className='m-0 flex list-none flex-col gap-3 p-0'>
          {startHereIds.map((id, index) => (
            <li
              key={index}
              className='flex flex-col gap-2 sm:flex-row sm:items-end'
            >
              <div className='flex-1'>
                <Label htmlFor={`start-${index}`}>Slot {index + 1}</Label>
                <select
                  id={`start-${index}`}
                  className='mt-1 w-full min-h-11 rounded-md border border-input bg-background px-3 text-sm'
                  value={id === "" ? "" : String(id)}
                  onChange={(e) =>
                    setSlot(
                      index,
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                >
                  <option value=''>None</option>
                  {published.map((e) => (
                    <option key={e.id} value={e.id}>
                      {essayLabel(e)}
                    </option>
                  ))}
                </select>
              </div>
              <div className='flex gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  disabled={index === 0 || loading}
                  onClick={() => moveSlot(index, -1)}
                >
                  Up
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  disabled={index === 2 || loading}
                  onClick={() => moveSlot(index, 1)}
                >
                  Down
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className='flex flex-wrap gap-3'>
        <Button type='button' onClick={() => void save()} disabled={loading}>
          {loading ? "Saving…" : "Save homepage"}
        </Button>
        <Button type='button' variant='outline' asChild>
          <Link href='/' target='_blank' rel='noopener noreferrer'>
            Preview home
          </Link>
        </Button>
      </div>
    </div>
  );
}
