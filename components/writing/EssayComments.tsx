"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/utils/AuthContext";
import {
  fetchApprovedComments,
  submitEssayComment,
  type EssayComment,
} from "@/lib/essayComments";

type Props = {
  essayId: number;
  initialComments?: EssayComment[];
};

function formatWhen(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Approved comments + signed-in submit (pending moderation). */
export default function EssayComments({
  essayId,
  initialComments = [],
}: Props) {
  const { isAuthenticated, token, username } = useAuth();
  const pathname = usePathname();
  const [comments, setComments] = useState<EssayComment[]>(initialComments);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = await fetchApprovedComments(essayId);
      if (!cancelled && list.length) setComments(list);
    })();
    return () => {
      cancelled = true;
    };
  }, [essayId]);

  const callback = encodeURIComponent(pathname || "/writing");
  const loginHref = `/login?callbackUrl=${callback}`;
  const signupHref = `/signup?callbackUrl=${callback}`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !body.trim()) return;
    setLoading(true);
    setMessage(null);
    setError(null);
    const result = await submitEssayComment(essayId, body.trim(), token);
    setLoading(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setMessage(result.message);
    setBody("");
  }

  return (
    <section className='flex flex-col gap-5' aria-labelledby='essay-comments'>
      <div>
        <h2
          id='essay-comments'
          className='font-display text-xl font-semibold text-foreground md:text-2xl'
        >
          Comments
        </h2>
        <p className='mt-1 text-sm text-muted-foreground'>
          Signed-in readers can comment. New comments are moderated before they
          appear.
        </p>
      </div>

      {comments.length === 0 ? (
        <p className='text-sm text-muted-foreground'>No comments yet.</p>
      ) : (
        <ul className='flex flex-col gap-4'>
          {comments.map((c) => (
            <li
              key={c.id}
              className='border-t border-border pt-4 first:border-t-0 first:pt-0'
            >
              <p className='text-sm font-medium text-foreground'>
                {c.authorName}
                {c.createdAt ? (
                  <span className='ml-2 font-normal text-muted-foreground'>
                    {formatWhen(c.createdAt)}
                  </span>
                ) : null}
              </p>
              <p className='mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90'>
                {c.body}
              </p>
            </li>
          ))}
        </ul>
      )}

      {isAuthenticated && token ? (
        <form onSubmit={onSubmit} className='flex flex-col gap-3'>
          <label htmlFor='essay-comment-body' className='sr-only'>
            Your comment
          </label>
          <Textarea
            id='essay-comment-body'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={2000}
            rows={4}
            placeholder={
              username
                ? `Comment as ${username}`
                : "Share a thoughtful note"
            }
            required
          />
          <div className='flex flex-wrap items-center gap-3'>
            <Button type='submit' disabled={loading || !body.trim()}>
              {loading ? "Sending…" : "Post comment"}
            </Button>
            <p className='text-xs text-muted-foreground'>
              Appears after moderation.
            </p>
          </div>
          {message ? (
            <p className='text-sm text-foreground' role='status'>
              {message}
            </p>
          ) : null}
          {error ? (
            <p className='text-sm text-destructive' role='alert'>
              {error}
            </p>
          ) : null}
        </form>
      ) : (
        <p className='text-sm text-muted-foreground'>
          <Link
            href={loginHref}
            className='font-semibold text-brand underline-offset-4 hover:underline'
          >
            Log in
          </Link>
          {" or "}
          <Link
            href={signupHref}
            className='font-semibold text-brand underline-offset-4 hover:underline'
          >
            sign up
          </Link>{" "}
          to leave a comment. Reader accounts are free.
        </p>
      )}
    </section>
  );
}
