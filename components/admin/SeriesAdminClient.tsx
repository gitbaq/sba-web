"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Topic } from "@/types/types";
import { useAuth } from "@/utils/AuthContext";
import { topics_secure_url } from "@/utils/endpoints/endpoints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type SeriesRow = Topic & { draftName?: string };

export default function SeriesAdminClient() {
  const { token } = useAuth();
  const [rows, setRows] = useState<SeriesRow[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(topics_secure_url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("load failed");
      const data = await res.json();
      setRows(
        (Array.isArray(data) ? data : []).map((t: Topic) => ({
          ...t,
          draftName: t.sbaTopicName,
        }))
      );
    } catch {
      toast.error("Could not load series");
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

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

  if (!token) {
    return (
      <p className='text-muted-foreground'>
        <Link href='/login' className='text-brand underline-offset-4 hover:underline'>
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
          <ul className='m-0 flex list-none flex-col gap-3 p-0'>
            {rows.map((row) => (
              <li
                key={row.id}
                className='rounded-xl border border-border bg-card p-4 flex flex-col gap-3'
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
                      id={`pub-${row.id}`}
                      checked={Boolean(row.isPublished)}
                      onCheckedChange={(checked) =>
                        setRows((prev) =>
                          prev.map((r) =>
                            r.id === row.id
                              ? { ...r, isPublished: checked }
                              : r
                          )
                        )
                      }
                    />
                    <Label htmlFor={`pub-${row.id}`}>Published</Label>
                  </div>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => saveSeries(row)}
                    disabled={loading}
                  >
                    Save
                  </Button>
                </div>
                <p className='text-xs text-muted-foreground'>
                  Id {row.id}
                  {row.subTopicList?.length != null
                    ? ` · ${row.subTopicList.length} essays (published)`
                    : null}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
