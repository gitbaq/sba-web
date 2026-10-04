"use client";

import { useState } from "react";
import { newsletter_send_links_url } from "@/utils/endpoints/endpoints";
import { readJson } from "@/lib/http";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  essayIds: number[];
  className?: string;
};

/**
 * Confirmed subscribers can email selected essay links to themselves.
 * Uses a honeypot + generic success copy so membership is not leaked.
 */
export default function SendLinksToMe({ essayIds, className = "" }: Props) {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(newsletter_send_links_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          essayIds,
          website: honeypot,
        }),
      });
      const data = await readJson<{ status?: string; message?: string }>(
        res,
        {}
      );
      if (!res.ok) {
        setError(data.message || "Could not send links. Try again later.");
        return;
      }
      setMessage(
        data.message ||
          "If that address is subscribed, check your inbox for a confirmation link."
      );
      setEmail("");
    } catch {
      setError("Could not send links. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  if (!essayIds.length) return null;

  return (
    <form
      onSubmit={onSubmit}
      className={`relative flex flex-col gap-3 ${className}`.trim()}
      aria-labelledby='send-links-heading'
    >
      <div>
        <h2
          id='send-links-heading'
          className='font-display text-lg font-semibold text-foreground'
        >
          Email these essays to yourself
        </h2>
        <p className='mt-1 text-sm text-muted-foreground'>
          Confirmed subscribers only. We email a confirmation link first, so
          nobody can send mail to an address they do not own. We never say
          whether an address is on the list.
        </p>
      </div>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-end'>
        <div className='flex-1'>
          <Label htmlFor='send-links-email'>Email</Label>
          <Input
            id='send-links-email'
            type='email'
            required
            autoComplete='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='mt-1'
            placeholder='you@example.com'
          />
        </div>
        {/* Honeypot */}
        <div className='absolute left-[-9999px]' aria-hidden>
          <Label htmlFor='send-links-company'>Company</Label>
          <Input
            id='send-links-company'
            tabIndex={-1}
            autoComplete='off'
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>
        <Button type='submit' disabled={loading || !email.trim()}>
          {loading ? "Sending…" : "Email me a confirmation link"}
        </Button>
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
  );
}
