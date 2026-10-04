"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useAuth } from "@/utils/AuthContext";
import { useConfirm } from "@/components/admin/ConfirmProvider";
import { errorMessage, fromApiBody } from "@/lib/adminErrors";
import { readJson } from "@/lib/http";
import {
  newsletter_subscriber_delete_url,
  newsletter_subscriber_resend_url,
  newsletter_subscriber_unsubscribe_url,
  newsletter_subscribers_growth_url,
  newsletter_subscribers_url,
} from "@/utils/endpoints/endpoints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type SubscriberRow = {
  id: number;
  email: string;
  status: string;
  sourcePath?: string | null;
  createdAt?: string | null;
  confirmedAt?: string | null;
  unsubscribedAt?: string | null;
};

type ListResponse = {
  items?: SubscriberRow[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
};

type GrowthPoint = { date: string; count: number };

function formatWhen(value?: string | null): string {
  if (!value) return "—";
  const t = Date.parse(value);
  if (!Number.isFinite(t)) return value;
  return new Date(t).toLocaleString();
}

export default function SubscribersAdminClient() {
  const { token, isAdmin } = useAuth();
  const confirm = useConfirm();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [joinedLastDays, setJoinedLastDays] = useState<string>("");
  const [sort, setSort] = useState("createdAt");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<SubscriberRow[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [growth, setGrowth] = useState<GrowthPoint[]>([]);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (status !== "all") params.set("status", status);
      if (joinedLastDays) params.set("joinedLastDays", joinedLastDays);
      params.set("sort", sort);
      params.set("dir", dir);
      params.set("page", String(page));
      params.set("size", "25");
      const res = await fetch(`${newsletter_subscribers_url}?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await readJson<ListResponse & { error?: string; message?: string }>(
        res,
        {}
      );
      if (!res.ok) {
        throw new Error(fromApiBody(body, "Could not load subscribers"));
      }
      setRows(Array.isArray(body.items) ? body.items : []);
      setTotalPages(body.totalPages || 0);
      setTotalElements(body.totalElements || 0);
    } catch (e) {
      const msg = errorMessage(e, "Could not load subscribers");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [token, q, status, joinedLastDays, sort, dir, page]);

  const loadGrowth = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${newsletter_subscribers_growth_url}?days=30`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await readJson<{ points?: GrowthPoint[]; error?: string }>(
        res,
        {}
      );
      if (!res.ok) {
        throw new Error(fromApiBody(body, "Could not load growth chart"));
      }
      setGrowth(Array.isArray(body.points) ? body.points : []);
    } catch (e) {
      toast.error(errorMessage(e, "Could not load growth chart"));
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    void loadGrowth();
  }, [loadGrowth]);

  async function resend(row: SubscriberRow) {
    if (!token) return;
    const ok = await confirm({
      title: "Resend confirmation email?",
      description: `Send a new confirmation link to ${row.email}.`,
      confirmLabel: "Resend",
    });
    if (!ok) return;
    try {
      const res = await fetch(newsletter_subscriber_resend_url(row.id), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await readJson<{ message?: string; error?: string }>(res, {});
      if (!res.ok) throw new Error(fromApiBody(body, "Resend failed"));
      toast.success(body.message || "Confirmation sent");
      await load();
    } catch (e) {
      toast.error(errorMessage(e, "Resend failed"));
    }
  }

  async function unsubscribe(row: SubscriberRow) {
    if (!token) return;
    const ok = await confirm({
      title: "Unsubscribe this address?",
      description: `${row.email} will stop receiving newsletter emails.`,
      confirmLabel: "Unsubscribe",
      variant: "destructive",
    });
    if (!ok) return;
    try {
      const res = await fetch(newsletter_subscriber_unsubscribe_url(row.id), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await readJson<{ message?: string; error?: string }>(res, {});
      if (!res.ok) throw new Error(fromApiBody(body, "Unsubscribe failed"));
      toast.success(body.message || "Unsubscribed");
      await load();
    } catch (e) {
      toast.error(errorMessage(e, "Unsubscribe failed"));
    }
  }

  async function remove(row: SubscriberRow) {
    if (!token) return;
    const ok = await confirm({
      title: "Delete subscriber record?",
      description: `Permanently delete ${row.email} from the subscribers table.`,
      confirmLabel: "Delete",
      variant: "destructive",
    });
    if (!ok) return;
    try {
      const res = await fetch(newsletter_subscriber_delete_url(row.id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await readJson<{ message?: string; error?: string }>(res, {});
      if (!res.ok) throw new Error(fromApiBody(body, "Delete failed"));
      toast.success(body.message || "Deleted");
      await load();
    } catch (e) {
      toast.error(errorMessage(e, "Delete failed"));
    }
  }

  function toggleSort(field: string) {
    if (sort === field) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSort(field);
      setDir("desc");
    }
    setPage(0);
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
        as admin to manage subscribers.
      </p>
    );
  }

  return (
    <div className='flex flex-col gap-8'>
      <section className='rounded-xl border border-border bg-card p-5'>
        <h2 className='font-display text-lg font-semibold mb-4'>
          Signups (30 days)
        </h2>
        {growth.length === 0 ? (
          <p className='text-sm text-muted-foreground'>No signup data yet.</p>
        ) : (
          <div className='h-56 w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={growth}>
                <CartesianGrid strokeDasharray='3 3' opacity={0.3} />
                <XAxis dataKey='date' tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type='monotone'
                  dataKey='count'
                  stroke='hsl(var(--brand))'
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className='rounded-xl border border-border bg-card p-5 flex flex-col gap-4'>
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          <div>
            <Label htmlFor='sub-q'>Email contains</Label>
            <Input
              id='sub-q'
              value={q}
              onChange={(e) => {
                setPage(0);
                setQ(e.target.value);
              }}
              placeholder='name or domain'
            />
          </div>
          <div>
            <Label htmlFor='sub-status'>Status</Label>
            <select
              id='sub-status'
              className='mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm'
              value={status}
              onChange={(e) => {
                setPage(0);
                setStatus(e.target.value);
              }}
            >
              <option value='all'>All</option>
              <option value='PENDING'>Pending</option>
              <option value='CONFIRMED'>Confirmed</option>
              <option value='UNSUBSCRIBED'>Unsubscribed</option>
            </select>
          </div>
          <div>
            <Label htmlFor='sub-days'>Joined in last X days</Label>
            <Input
              id='sub-days'
              type='number'
              min={1}
              value={joinedLastDays}
              onChange={(e) => {
                setPage(0);
                setJoinedLastDays(e.target.value);
              }}
              placeholder='e.g. 7'
            />
          </div>
          <div className='flex items-end'>
            <Button
              type='button'
              variant='outline'
              disabled={loading}
              onClick={() => void load()}
            >
              Refresh
            </Button>
          </div>
        </div>

        {error ? (
          <p className='text-sm text-destructive' role='alert'>
            {error}
          </p>
        ) : null}

        <p className='text-sm text-muted-foreground'>
          {totalElements} subscriber{totalElements === 1 ? "" : "s"}
          {loading ? " · Loading…" : ""}
        </p>

        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-border text-left'>
                <th className='py-2 pr-3'>
                  <button
                    type='button'
                    className='font-semibold'
                    onClick={() => toggleSort("email")}
                  >
                    Email {sort === "email" ? (dir === "asc" ? "↑" : "↓") : ""}
                  </button>
                </th>
                <th className='py-2 pr-3'>
                  <button
                    type='button'
                    className='font-semibold'
                    onClick={() => toggleSort("status")}
                  >
                    Status {sort === "status" ? (dir === "asc" ? "↑" : "↓") : ""}
                  </button>
                </th>
                <th className='py-2 pr-3'>
                  <button
                    type='button'
                    className='font-semibold'
                    onClick={() => toggleSort("createdAt")}
                  >
                    Joined{" "}
                    {sort === "createdAt" ? (dir === "asc" ? "↑" : "↓") : ""}
                  </button>
                </th>
                <th className='py-2 pr-3'>Source</th>
                <th className='py-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className='border-b border-border/70'>
                  <td className='py-2 pr-3 font-medium'>{row.email}</td>
                  <td className='py-2 pr-3'>{row.status}</td>
                  <td className='py-2 pr-3 whitespace-nowrap'>
                    {formatWhen(row.createdAt)}
                  </td>
                  <td className='py-2 pr-3 text-muted-foreground'>
                    {row.sourcePath || "—"}
                  </td>
                  <td className='py-2'>
                    <div className='flex flex-wrap gap-2'>
                      {row.status !== "CONFIRMED" ? (
                        <Button
                          type='button'
                          size='sm'
                          variant='outline'
                          onClick={() => void resend(row)}
                        >
                          Resend confirm
                        </Button>
                      ) : null}
                      {row.status !== "UNSUBSCRIBED" ? (
                        <Button
                          type='button'
                          size='sm'
                          variant='outline'
                          onClick={() => void unsubscribe(row)}
                        >
                          Unsubscribe
                        </Button>
                      ) : null}
                      <Button
                        type='button'
                        size='sm'
                        variant='destructive'
                        onClick={() => void remove(row)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className='py-6 text-muted-foreground'>
                    No subscribers match these filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className='flex flex-wrap items-center gap-3'>
          <Button
            type='button'
            variant='outline'
            disabled={loading || page <= 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Previous
          </Button>
          <span className='text-sm text-muted-foreground'>
            Page {page + 1} of {Math.max(1, totalPages)}
          </span>
          <Button
            type='button'
            variant='outline'
            disabled={loading || page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </section>
    </div>
  );
}
