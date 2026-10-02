"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SubTopic, Topic } from "@/types/types";
import { useAuth } from "@/utils/AuthContext";
import {
  subtopics_secure_url,
  subtopics_url,
  topics_secure_url,
} from "@/utils/endpoints/endpoints";
import { readJson } from "@/lib/http";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type SeriesRow = Topic & { draftName?: string };

function essayTitle(essay: SubTopic): string {
  return essay.subHeading || essay.heading || `Essay ${essay.id}`;
}

export default function SeriesAdminClient() {
  const { token } = useAuth();
  const [rows, setRows] = useState<SeriesRow[]>([]);
  const [essays, setEssays] = useState<SubTopic[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [moveAllTarget, setMoveAllTarget] = useState<Record<number, string>>(
    {}
  );

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const [seriesRes, essaysRes] = await Promise.all([
        fetch(topics_secure_url, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(subtopics_url),
      ]);
      if (!seriesRes.ok) throw new Error("series load failed");
      if (!essaysRes.ok) throw new Error("essays load failed");
      const seriesData = await readJson<Topic[]>(seriesRes, []);
      const essaysData = await readJson<SubTopic[]>(essaysRes, []);
      setRows(
        (Array.isArray(seriesData) ? seriesData : []).map((t: Topic) => ({
          ...t,
          draftName: t.sbaTopicName,
        }))
      );
      setEssays(Array.isArray(essaysData) ? essaysData : []);
    } catch {
      toast.error("Could not load series");
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const essaysBySeries = useMemo(() => {
    const map = new Map<number, SubTopic[]>();
    for (const essay of essays) {
      const tid = Number(essay.topicId) || 0;
      if (!tid) continue;
      const list = map.get(tid) || [];
      list.push(essay);
      map.set(tid, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => {
        const ao = a.seriesOrder ?? Number.MAX_SAFE_INTEGER;
        const bo = b.seriesOrder ?? Number.MAX_SAFE_INTEGER;
        if (ao !== bo) return ao - bo;
        return (a.subHeading || a.heading || "").localeCompare(
          b.subHeading || b.heading || ""
        );
      });
    }
    return map;
  }, [essays]);

  async function createSeries() {
    if (!token || !newName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(topics_secure_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sbaTopicName: newName.trim(),
          isPublished: true,
        }),
      });
      if (!res.ok) throw new Error("create failed");
      setNewName("");
      toast.success("Series created");
      await load();
    } catch {
      toast.error("Could not create series");
    } finally {
      setLoading(false);
    }
  }

  async function saveSeries(row: SeriesRow) {
    if (!token) return;
    const name = (row.draftName || "").trim();
    if (!name) {
      toast.error("Name is required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(topics_secure_url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: row.id,
          sbaTopicName: name,
          isPublished: Boolean(row.isPublished),
        }),
      });
      if (!res.ok) throw new Error("update failed");
      toast.success("Series updated");
      await load();
    } catch {
      toast.error("Could not update series");
    } finally {
      setLoading(false);
    }
  }

  async function setSeriesActive(row: SeriesRow, active: boolean) {
    if (!token) return;
    setRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, isPublished: active } : r))
    );
    setLoading(true);
    try {
      const res = await fetch(topics_secure_url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: row.id,
          sbaTopicName: (row.draftName || row.sbaTopicName || "").trim(),
          isPublished: active,
        }),
      });
      if (!res.ok) throw new Error("update failed");
      toast.success(active ? "Series activated" : "Series deactivated");
      await load();
    } catch {
      toast.error("Could not update series");
      await load();
    } finally {
      setLoading(false);
    }
  }

  async function reassignEssay(essayId: number, targetTopicId: number) {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(subtopics_secure_url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: essayId, topicId: targetTopicId }),
      });
      if (!res.ok) throw new Error("reassign failed");
      toast.success(
        targetTopicId ? "Essay moved to series" : "Essay removed from series"
      );
      await load();
    } catch {
      toast.error("Could not reassign essay");
    } finally {
      setLoading(false);
    }
  }

  async function moveAllEssays(fromSeriesId: number, toTopicId: number) {
    if (!token) return;
    const list = essaysBySeries.get(fromSeriesId) || [];
    if (list.length === 0) return;
    setLoading(true);
    try {
      for (const essay of list) {
        const res = await fetch(subtopics_secure_url, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: essay.id, topicId: toTopicId }),
        });
        if (!res.ok) throw new Error("move failed");
      }
      toast.success(
        toTopicId
          ? `Moved ${list.length} essay(s)`
          : `Removed ${list.length} essay(s) from series`
      );
      setMoveAllTarget((prev) => ({ ...prev, [fromSeriesId]: "" }));
      await load();
    } catch {
      toast.error("Could not move all essays");
      await load();
    } finally {
      setLoading(false);
    }
  }

  async function deleteSeries(row: SeriesRow) {
    if (!token) return;
    const count = essaysBySeries.get(row.id)?.length ?? 0;
    if (count > 0) {
      toast.error(
        `Reassign ${count} essay(s) to another series before deleting.`
      );
      return;
    }
    if (
      !window.confirm(
        `Delete series “${row.draftName || row.sbaTopicName}”? This cannot be undone.`
      )
    ) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${topics_secure_url}/${row.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 409) {
        const body = await readJson<{ message?: string; detail?: string } | null>(
          res,
          null
        );
        const msg =
          (typeof body?.message === "string" && body.message) ||
          (typeof body?.detail === "string" && body.detail) ||
          "Series still has essays";
        toast.error(msg);
        await load();
        return;
      }
      if (!res.ok && res.status !== 204) throw new Error("delete failed");
      toast.success("Series deleted");
      await load();
    } catch {
      toast.error("Could not delete series");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <p className='text-muted-foreground'>
        <Link
          href='/login'
          className='text-brand underline-offset-4 hover:underline'
        >
          Sign in
        </Link>{" "}
        to manage series.
      </p>
    );
  }

  return (
    <div className='flex flex-col gap-8'>
      <section className='rounded-xl border border-border bg-card p-5'>
        <h2 className='font-display text-lg font-semibold mb-4'>Add series</h2>
        <div className='flex flex-col sm:flex-row gap-3 sm:items-end'>
          <div className='flex-1'>
            <Label htmlFor='new-series'>Name</Label>
            <Input
              id='new-series'
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder='e.g. Applied AI'
            />
          </div>
          <Button type='button' onClick={createSeries} disabled={loading}>
            Create
          </Button>
        </div>
      </section>

      <section>
        <h2 className='font-display text-lg font-semibold mb-4'>
          Existing series
        </h2>
        {rows.length === 0 ? (
          <p className='text-muted-foreground text-sm'>No series yet.</p>
        ) : (
          <ul className='m-0 flex list-none flex-col gap-4 p-0'>
            {rows.map((row) => {
              const linked = essaysBySeries.get(row.id) || [];
              const otherSeries = rows.filter((r) => r.id !== row.id);
              const moveTarget = moveAllTarget[row.id] ?? "";
              return (
                <li
                  key={row.id}
                  className='rounded-xl border border-border bg-card p-4 flex flex-col gap-4'
                >
                  <div className='flex flex-col sm:flex-row gap-3 sm:items-end'>
                    <div className='flex-1'>
                      <Label htmlFor={`name-${row.id}`}>Name</Label>
                      <Input
                        id={`name-${row.id}`}
                        value={row.draftName ?? ""}
                        onChange={(e) =>
                          setRows((prev) =>
                            prev.map((r) =>
                              r.id === row.id
                                ? { ...r, draftName: e.target.value }
                                : r
                            )
                          )
                        }
                      />
                    </div>
                    <div className='flex items-center gap-2 pb-2'>
                      <Switch
                        id={`active-${row.id}`}
                        checked={Boolean(row.isPublished)}
                        onCheckedChange={(checked) =>
                          void setSeriesActive(row, checked)
                        }
                        disabled={loading}
                      />
                      <Label htmlFor={`active-${row.id}`}>Active</Label>
                    </div>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => saveSeries(row)}
                      disabled={loading}
                    >
                      Save name
                    </Button>
                    <Button
                      type='button'
                      variant='destructive'
                      onClick={() => void deleteSeries(row)}
                      disabled={loading || linked.length > 0}
                      title={
                        linked.length > 0
                          ? "Reassign essays before deleting"
                          : "Delete series"
                      }
                    >
                      Delete
                    </Button>
                  </div>

                  <p className='text-xs text-muted-foreground'>
                    Id {row.id} · {linked.length} essay
                    {linked.length === 1 ? "" : "s"}
                    {!row.isPublished ? " · inactive" : ""}
                  </p>

                  {linked.length > 0 && (
                    <div className='rounded-lg border border-border/80 bg-background/60 p-3 flex flex-col gap-3'>
                      <p className='text-sm font-medium text-foreground'>
                        Essays in this series
                      </p>
                      <ul className='m-0 flex list-none flex-col gap-2 p-0'>
                        {linked.map((essay) => (
                          <li
                            key={essay.id}
                            className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'
                          >
                            <div className='min-w-0'>
                              <Link
                                href={`/editor/${essay.id}`}
                                className='text-sm text-brand underline-offset-4 hover:underline truncate block'
                              >
                                {essayTitle(essay)}
                              </Link>
                            </div>
                            <select
                              aria-label={`Move ${essayTitle(essay)}`}
                              className='min-h-10 rounded-md border border-input bg-background px-2 text-sm sm:max-w-xs'
                              value=''
                              disabled={loading}
                              onChange={(e) => {
                                const next = Number(e.target.value);
                                if (Number.isNaN(next)) return;
                                void reassignEssay(essay.id, next);
                              }}
                            >
                              <option value=''>Move to…</option>
                              <option value='0'>No series</option>
                              {otherSeries.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.draftName || s.sbaTopicName}
                                </option>
                              ))}
                            </select>
                          </li>
                        ))}
                      </ul>
                      <div className='flex flex-col sm:flex-row gap-2 sm:items-end pt-1 border-t border-border/60'>
                        <div className='flex-1'>
                          <Label htmlFor={`move-all-${row.id}`}>
                            Move all essays to
                          </Label>
                          <select
                            id={`move-all-${row.id}`}
                            className='mt-1 w-full min-h-10 rounded-md border border-input bg-background px-2 text-sm'
                            value={moveTarget}
                            disabled={loading}
                            onChange={(e) =>
                              setMoveAllTarget((prev) => ({
                                ...prev,
                                [row.id]: e.target.value,
                              }))
                            }
                          >
                            <option value=''>Choose destination…</option>
                            <option value='0'>No series</option>
                            {otherSeries.map((s) => (
                              <option key={s.id} value={String(s.id)}>
                                {s.draftName || s.sbaTopicName}
                              </option>
                            ))}
                          </select>
                        </div>
                        <Button
                          type='button'
                          variant='outline'
                          disabled={loading || moveTarget === ""}
                          onClick={() =>
                            void moveAllEssays(row.id, Number(moveTarget))
                          }
                        >
                          Move all
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
