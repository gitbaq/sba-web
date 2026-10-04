"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/utils/AuthContext";
import { work_projects_secure_url } from "@/utils/endpoints/endpoints";
import { CaseStudy } from "@/lib/work";
import { readJson } from "@/lib/http";
import MediaPicker from "@/components/admin/MediaPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type Draft = CaseStudy & {
  approachText?: string;
  outcomeText?: string;
  stackText?: string;
};

function linesToList(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function listToLines(list?: string[]): string {
  return (list || []).join("\n");
}

function emptyDraft(): Draft {
  return {
    slug: "",
    title: "",
    tagline: "",
    href: "",
    mark: "",
    role: "",
    timeline: "",
    result: "",
    problem: "",
    approach: [],
    outcome: [],
    stack: [],
    isVisible: true,
    approachText: "",
    outcomeText: "",
    stackText: "",
  };
}

export default function WorkAdminClient() {
  const { token, isAdmin } = useAuth();
  const [rows, setRows] = useState<Draft[]>([]);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(work_projects_secure_url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("load failed");
      const data = await readJson<CaseStudy[]>(res, []);
      const list: Draft[] = (Array.isArray(data) ? data : []).map(
        (p: CaseStudy) => ({
          ...p,
          href: `/work/${p.slug}`,
          approachText: listToLines(p.approach),
          outcomeText: listToLines(p.outcome),
          stackText: listToLines(p.stack),
        })
      );
      setRows(list);
    } catch {
      toast.error("Could not load projects");
    } finally {
      setReady(true);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  async function revalidateWork() {
    try {
      await fetch("/api/admin/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paths: ["/", "/work", "/work-with-me", "/about"],
          tag: "work-projects",
        }),
      });
    } catch {
      /* best-effort */
    }
  }

  async function saveProject(draft: Draft) {
    if (!token) return;
    setLoading(true);
    try {
      const body = {
        id: draft.id,
        slug: draft.slug,
        title: draft.title,
        tagline: draft.tagline,
        externalUrl: draft.externalUrl || null,
        mark: draft.mark || null,
        role: draft.role,
        timeline: draft.timeline,
        result: draft.result,
        problem: draft.problem,
        approach: linesToList(draft.approachText || ""),
        outcome: linesToList(draft.outcomeText || ""),
        stack: linesToList(draft.stackText || ""),
        sortOrder: draft.sortOrder,
        isVisible: draft.isVisible !== false,
      };
      const res = await fetch(work_projects_secure_url, {
        method: draft.id ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await readJson<{ message?: string; detail?: string } | null>(
          res,
          null
        );
        throw new Error(err?.message || err?.detail || "Save failed");
      }
      toast.success(draft.id ? "Project updated" : "Project created");
      setEditing(null);
      await load();
      await revalidateWork();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setLoading(false);
    }
  }

  async function toggleVisible(row: Draft, visible: boolean) {
    if (!token || !row.id) return;
    setLoading(true);
    try {
      const res = await fetch(work_projects_secure_url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: row.id, isVisible: visible }),
      });
      if (!res.ok) throw new Error("update failed");
      toast.success(visible ? "Project visible" : "Project hidden");
      await load();
      await revalidateWork();
    } catch {
      toast.error("Could not update visibility");
    } finally {
      setLoading(false);
    }
  }

  async function move(row: Draft, dir: -1 | 1) {
    if (!token) return;
    const idx = rows.findIndex((r) => r.id === row.id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= rows.length) return;
    const orderedIds = rows.map((r) => r.id!).filter(Boolean);
    const tmp = orderedIds[idx];
    orderedIds[idx] = orderedIds[swap];
    orderedIds[swap] = tmp;
    setLoading(true);
    try {
      const res = await fetch(`${work_projects_secure_url}/reorder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderedIds }),
      });
      if (!res.ok) throw new Error("reorder failed");
      await load();
      await revalidateWork();
    } catch {
      toast.error("Could not reorder");
    } finally {
      setLoading(false);
    }
  }

  async function remove(row: Draft) {
    if (!token || !row.id) return;
    if (!window.confirm(`Delete project “${row.title}”?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`${work_projects_secure_url}/${row.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok && res.status !== 204) throw new Error("delete failed");
      toast.success("Project deleted");
      await load();
      await revalidateWork();
    } catch {
      toast.error("Could not delete");
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
        as admin to manage work projects.
      </p>
    );
  }

  if (!ready) {
    return <p className='text-sm text-muted-foreground'>Loading…</p>;
  }

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-wrap gap-3'>
        <Button
          type='button'
          onClick={() => setEditing(emptyDraft())}
          disabled={loading || editing != null}
        >
          Add project
        </Button>
        <Button type='button' variant='outline' asChild>
          <Link href='/work' target='_blank' rel='noopener noreferrer'>
            Preview Work
          </Link>
        </Button>
      </div>

      {editing && (
        <section className='rounded-xl border border-border bg-card p-5 flex flex-col gap-4'>
          <h2 className='font-display text-lg font-semibold'>
            {editing.id ? `Edit ${editing.title}` : "New project"}
          </h2>
          <div className='grid gap-3 sm:grid-cols-2'>
            <div>
              <Label htmlFor='wp-title'>Title</Label>
              <Input
                id='wp-title'
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor='wp-slug'>Slug</Label>
              <Input
                id='wp-slug'
                value={editing.slug}
                onChange={(e) =>
                  setEditing({ ...editing, slug: e.target.value })
                }
                placeholder='cobu'
              />
            </div>
            <div className='sm:col-span-2'>
              <Label htmlFor='wp-tagline'>Tagline</Label>
              <Input
                id='wp-tagline'
                value={editing.tagline}
                onChange={(e) =>
                  setEditing({ ...editing, tagline: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor='wp-external'>Live URL</Label>
              <Input
                id='wp-external'
                value={editing.externalUrl || ""}
                onChange={(e) =>
                  setEditing({ ...editing, externalUrl: e.target.value })
                }
              />
            </div>
            <div className='sm:col-span-2'>
              <MediaPicker
                label='Mark / image'
                value={editing.mark}
                onSelect={(url) => setEditing({ ...editing, mark: url })}
                defaultPrefix='portfolio/'
                uploadFolder='portfolio'
              />
            </div>
            <div>
              <Label htmlFor='wp-role'>Role</Label>
              <Input
                id='wp-role'
                value={editing.role}
                onChange={(e) =>
                  setEditing({ ...editing, role: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor='wp-timeline'>Timeline</Label>
              <Input
                id='wp-timeline'
                value={editing.timeline}
                onChange={(e) =>
                  setEditing({ ...editing, timeline: e.target.value })
                }
              />
            </div>
            <div className='sm:col-span-2'>
              <Label htmlFor='wp-result'>Result</Label>
              <textarea
                id='wp-result'
                className='mt-1 w-full min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm'
                value={editing.result}
                onChange={(e) =>
                  setEditing({ ...editing, result: e.target.value })
                }
              />
            </div>
            <div className='sm:col-span-2'>
              <Label htmlFor='wp-problem'>Problem</Label>
              <textarea
                id='wp-problem'
                className='mt-1 w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm'
                value={editing.problem}
                onChange={(e) =>
                  setEditing({ ...editing, problem: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor='wp-approach'>Approach (one per line)</Label>
              <textarea
                id='wp-approach'
                className='mt-1 w-full min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm'
                value={editing.approachText || ""}
                onChange={(e) =>
                  setEditing({ ...editing, approachText: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor='wp-outcome'>Outcome (one per line)</Label>
              <textarea
                id='wp-outcome'
                className='mt-1 w-full min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm'
                value={editing.outcomeText || ""}
                onChange={(e) =>
                  setEditing({ ...editing, outcomeText: e.target.value })
                }
              />
            </div>
            <div className='sm:col-span-2'>
              <Label htmlFor='wp-stack'>Stack (one per line)</Label>
              <textarea
                id='wp-stack'
                className='mt-1 w-full min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm'
                value={editing.stackText || ""}
                onChange={(e) =>
                  setEditing({ ...editing, stackText: e.target.value })
                }
              />
            </div>
            <div className='flex items-center gap-2'>
              <Switch
                id='wp-visible'
                checked={editing.isVisible !== false}
                onCheckedChange={(v) =>
                  setEditing({ ...editing, isVisible: v })
                }
              />
              <Label htmlFor='wp-visible'>Visible on Work page</Label>
            </div>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Button
              type='button'
              disabled={loading || !editing.title.trim()}
              onClick={() => void saveProject(editing)}
            >
              Save
            </Button>
            <Button
              type='button'
              variant='outline'
              disabled={loading}
              onClick={() => setEditing(null)}
            >
              Cancel
            </Button>
          </div>
        </section>
      )}

      <section>
        <h2 className='font-display text-lg font-semibold mb-4'>
          Projects ({rows.length})
        </h2>
        {rows.length === 0 ? (
          <p className='text-sm text-muted-foreground'>No projects yet.</p>
        ) : (
          <ul className='m-0 flex list-none flex-col gap-3 p-0'>
            {rows.map((row, index) => (
              <li
                key={row.id || row.slug}
                className='rounded-xl border border-border bg-card p-4 flex flex-col gap-3'
              >
                <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                  <div className='min-w-0'>
                    <p className='font-medium truncate'>
                      {row.title}
                      {!row.isVisible ? (
                        <span className='ml-2 text-xs text-amber-700 dark:text-amber-400'>
                          Hidden
                        </span>
                      ) : null}
                    </p>
                    <p className='text-xs text-muted-foreground truncate'>
                      /work/{row.slug}
                      {row.externalUrl ? ` · ${row.externalUrl}` : ""}
                    </p>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      disabled={loading || index === 0}
                      onClick={() => void move(row, -1)}
                    >
                      Up
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      disabled={loading || index === rows.length - 1}
                      onClick={() => void move(row, 1)}
                    >
                      Down
                    </Button>
                    <div className='flex items-center gap-2 px-1'>
                      <Switch
                        checked={row.isVisible !== false}
                        disabled={loading}
                        onCheckedChange={(v) => void toggleVisible(row, v)}
                      />
                      <span className='text-xs text-muted-foreground'>Show</span>
                    </div>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      disabled={loading || editing != null}
                      onClick={() => setEditing({ ...row })}
                    >
                      Edit
                    </Button>
                    <Button
                      type='button'
                      variant='destructive'
                      size='sm'
                      disabled={loading}
                      onClick={() => void remove(row)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
