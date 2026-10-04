"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/utils/AuthContext";
import {
  comments_admin_url,
  comments_approve_url,
  comments_reject_url,
} from "@/utils/endpoints/endpoints";
import { readJson } from "@/lib/http";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/admin/ConfirmProvider";
import { errorMessage, fromApiBody } from "@/lib/adminErrors";

type Item = {
  id: number;
  essayId: number;
  authorName: string;
  body: string;
  status: string;
  createdAt?: string;
};

type ListResponse = {
  items?: Item[];
  pendingCount?: number;
  total?: number;
};

export default function CommentsAdminClient() {
  const { token, isAdmin } = useAuth();
  const confirm = useConfirm();
  const [status, setStatus] = useState("PENDING");
  const [items, setItems] = useState<Item[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${comments_admin_url}?status=${encodeURIComponent(status)}&page=0&size=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await readJson<ListResponse & { message?: string; error?: string }>(
        res,
        {}
      );
      if (!res.ok) {
        setError(fromApiBody(data, `Could not load comments (${res.status})`));
        setItems([]);
        return;
      }
      setItems(Array.isArray(data.items) ? data.items : []);
      setPendingCount(
        typeof data.pendingCount === "number" ? data.pendingCount : 0
      );
    } catch (e) {
      setError(errorMessage(e, "Could not load comments"));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token, status]);

  useEffect(() => {
    void load();
  }, [load]);

  async function moderate(id: number, action: "approve" | "reject") {
    if (!token) return;
    const ok = await confirm({
      title: action === "approve" ? "Approve comment?" : "Reject comment?",
      description:
        action === "approve"
          ? "It will appear on the essay page."
          : "It will stay hidden from readers.",
      confirmLabel: action === "approve" ? "Approve" : "Reject",
    });
    if (!ok) return;
    const url =
      action === "approve" ? comments_approve_url(id) : comments_reject_url(id);
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await readJson<{ message?: string }>(res, {});
      setError(fromApiBody(data, `Could not ${action} comment`));
      return;
    }
    await load();
  }

  if (!token || !isAdmin) {
    return (
      <p className='text-sm text-muted-foreground'>
        Sign in as admin to moderate comments.
      </p>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-wrap items-center gap-3'>
        <p className='text-sm text-muted-foreground'>
          Pending: <span className='font-semibold text-foreground'>{pendingCount}</span>
        </p>
        <label className='text-sm text-muted-foreground'>
          Filter{" "}
          <select
            className='ml-1 rounded-md border border-border bg-background px-2 py-1 text-foreground'
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value='PENDING'>Pending</option>
            <option value='APPROVED'>Approved</option>
            <option value='REJECTED'>Rejected</option>
            <option value='all'>All</option>
          </select>
        </label>
        <Button type='button' variant='outline' size='sm' onClick={() => void load()}>
          Refresh
        </Button>
      </div>

      {error ? (
        <p className='text-sm text-destructive' role='alert'>
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className='text-sm text-muted-foreground'>Loading…</p>
      ) : items.length === 0 ? (
        <p className='text-sm text-muted-foreground'>No comments in this filter.</p>
      ) : (
        <ul className='flex flex-col gap-4'>
          {items.map((item) => (
            <li
              key={item.id}
              className='rounded-lg border border-border p-4 flex flex-col gap-3'
            >
              <div className='flex flex-wrap items-baseline justify-between gap-2'>
                <p className='text-sm font-medium text-foreground'>
                  {item.authorName}{" "}
                  <span className='font-normal text-muted-foreground'>
                    · essay #{item.essayId} · {item.status}
                  </span>
                </p>
                {item.createdAt ? (
                  <p className='text-xs text-muted-foreground'>
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                ) : null}
              </div>
              <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground/90'>
                {item.body}
              </p>
              {item.status === "PENDING" ? (
                <div className='flex flex-wrap gap-2'>
                  <Button
                    type='button'
                    size='sm'
                    onClick={() => void moderate(item.id, "approve")}
                  >
                    Approve
                  </Button>
                  <Button
                    type='button'
                    size='sm'
                    variant='outline'
                    onClick={() => void moderate(item.id, "reject")}
                  >
                    Reject
                  </Button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
