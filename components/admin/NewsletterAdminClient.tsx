"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SubTopic } from "@/types/types";
import { useAuth } from "@/utils/AuthContext";
import {
  newsletter_draft_url,
  newsletter_drafts_url,
  newsletter_preview_send_url,
  newsletter_preview_url,
  newsletter_send_detail_url,
  newsletter_send_url,
  newsletter_sends_url,
  newsletter_stats_url,
  newsletter_subscribers_url,
  subtopics_url,
} from "@/utils/endpoints/endpoints";
import { isIndexable } from "@/lib/articles";
import { errorMessage, fromApiBody } from "@/lib/adminErrors";
import { readJson } from "@/lib/http";
import { useConfirm } from "@/components/admin/ConfirmProvider";
import MediaPicker from "@/components/admin/MediaPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Stats = {
  total?: number;
  pending?: number;
  confirmed?: number;
  unsubscribed?: number;
  confirmationRatePercent?: number;
  confirmedLast7Days?: number;
  growthPercent7d?: number | null;
};

type SendResult = {
  essayId?: number;
  title?: string;
  subject?: string;
  confirmedCount?: number;
  recipientCount?: number;
  dryRun?: boolean;
  wouldSend?: number;
  sent?: number | boolean;
  failed?: number;
  message?: string;
  alreadySent?: boolean;
  targeted?: boolean;
  error?: string;
  sendLogId?: number;
  scheduled?: boolean;
  scheduledAt?: string;
  previewRecipients?: string[];
};

type SendLog = {
  id: number;
  essayId?: number;
  essayTitle?: string;
  status?: string;
  scheduledAt?: string | null;
  sentCount?: number | null;
  failedCount?: number | null;
  recipientCount?: number | null;
  errorMessage?: string | null;
};

type Recipient = {
  email: string;
  result: string;
  subscriberId?: number | null;
};

type SubscriberRow = {
  id: number;
  email: string;
  status: string;
};

type DraftSummary = {
  id: number;
  name: string;
  subject?: string | null;
  bannerText?: string | null;
  updatedAt?: string | null;
  essayCount?: number;
};

type DraftDetail = DraftSummary & {
  introText?: string | null;
  headerImageUrl?: string | null;
  essayIds?: number[];
  popularEssayIds?: number[];
  subscriberIds?: number[];
};

function essayLabel(e: SubTopic): string {
  return e.subHeading || e.heading || `Essay ${e.id}`;
}

function toLocalInput(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toggleId(list: number[], id: number, max: number): number[] {
  if (list.includes(id)) return list.filter((x) => x !== id);
  if (list.length >= max) return list;
  return [...list, id];
}

export default function NewsletterAdminClient() {
  const { token, isAdmin, userEmail } = useAuth();
  const confirm = useConfirm();
  const [essays, setEssays] = useState<SubTopic[]>([]);
  const [featuredIds, setFeaturedIds] = useState<number[]>([]);
  const [popularIds, setPopularIds] = useState<number[]>([]);
  const [introText, setIntroText] = useState("");
  const [bannerText, setBannerText] = useState("");
  const [headerImageUrl, setHeaderImageUrl] = useState("");
  const [subject, setSubject] = useState("");
  const [draftName, setDraftName] = useState("");
  const [draftId, setDraftId] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<DraftSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<SendResult | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [scheduleAt, setScheduleAt] = useState("");
  const [sends, setSends] = useState<SendLog[]>([]);
  const [selectedSendId, setSelectedSendId] = useState<number | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [confirmedSubs, setConfirmedSubs] = useState<SubscriberRow[]>([]);
  const [selectedSubIds, setSelectedSubIds] = useState<number[]>([]);
  const [targetMode, setTargetMode] = useState<"all" | "selected">("all");
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewSubject, setPreviewSubject] = useState<string | null>(null);

  const composerBody = useCallback(
    () => ({
      essayId: featuredIds[0],
      essayIds: featuredIds,
      popularEssayIds: popularIds,
      introText: introText.trim() || null,
      bannerText: bannerText.trim() || null,
      headerImageUrl: headerImageUrl.trim() || null,
      subject: subject.trim() || null,
      subscriberIds: targetMode === "selected" ? selectedSubIds : [],
      draftId,
    }),
    [
      featuredIds,
      popularIds,
      introText,
      bannerText,
      headerImageUrl,
      subject,
      targetMode,
      selectedSubIds,
      draftId,
    ]
  );

  const loadStats = useCallback(async () => {
    if (!token) return;
    setStatsError(null);
    try {
      const res = await fetch(newsletter_stats_url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await readJson<Stats & { error?: string }>(res, {});
      if (!res.ok) {
        throw new Error(fromApiBody(body, "Could not load subscriber stats"));
      }
      setStats(body);
    } catch (e) {
      const msg = errorMessage(e, "Could not load subscriber stats");
      setStatsError(msg);
      toast.error(msg);
    }
  }, [token]);

  const loadSends = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(newsletter_sends_url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await readJson<SendLog[] | { error?: string }>(res, []);
      if (!res.ok) {
        throw new Error(
          fromApiBody(body as { error?: string }, "Could not load send history")
        );
      }
      setSends(Array.isArray(body) ? body : []);
    } catch (e) {
      toast.error(errorMessage(e, "Could not load send history"));
    }
  }, [token]);

  const loadDrafts = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(newsletter_drafts_url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await readJson<DraftSummary[] | { error?: string }>(res, []);
      if (!res.ok) {
        throw new Error(
          fromApiBody(body as { error?: string }, "Could not load drafts")
        );
      }
      setDrafts(Array.isArray(body) ? body : []);
    } catch (e) {
      toast.error(errorMessage(e, "Could not load drafts"));
    }
  }, [token]);

  const loadEssays = useCallback(async () => {
    try {
      const res = await fetch(subtopics_url);
      if (!res.ok) throw new Error("Could not load essays");
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
      setFeaturedIds((current) =>
        current.length === 0 && published.length ? [published[0].id] : current
      );
    } catch (e) {
      toast.error(errorMessage(e, "Could not load essays"));
    }
  }, []);

  const loadConfirmedSubs = useCallback(async () => {
    if (!token) return;
    try {
      const params = new URLSearchParams({
        status: "CONFIRMED",
        size: "100",
        sort: "email",
        dir: "asc",
      });
      const res = await fetch(`${newsletter_subscribers_url}?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await readJson<{ items?: SubscriberRow[] }>(res, {});
      if (!res.ok) throw new Error("Could not load subscribers");
      setConfirmedSubs(Array.isArray(body.items) ? body.items : []);
    } catch (e) {
      toast.error(errorMessage(e, "Could not load subscribers"));
    }
  }, [token]);

  const loadRecipients = useCallback(
    async (sendId: number) => {
      if (!token) return;
      try {
        const res = await fetch(newsletter_send_detail_url(sendId), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const body = await readJson<{
          recipients?: Recipient[];
          error?: string;
        }>(res, {});
        if (!res.ok) {
          throw new Error(fromApiBody(body, "Could not load recipients"));
        }
        setSelectedSendId(sendId);
        setRecipients(Array.isArray(body.recipients) ? body.recipients : []);
      } catch (e) {
        toast.error(errorMessage(e, "Could not load recipients"));
      }
    },
    [token]
  );

  useEffect(() => {
    void loadEssays();
    void loadStats();
    void loadSends();
    void loadConfirmedSubs();
    void loadDrafts();
  }, [loadEssays, loadStats, loadSends, loadConfirmedSubs, loadDrafts]);

  const primary = essays.find((e) => e.id === featuredIds[0]);
  const alreadySent = Boolean(primary?.newsletterSentAt);
  const sendToCount =
    targetMode === "selected"
      ? selectedSubIds.length
      : Number(stats?.confirmed ?? 0);

  const metricCards = useMemo(
    () => [
      { label: "Confirmed", value: stats?.confirmed ?? 0, hint: "Will receive blasts" },
      { label: "Pending", value: stats?.pending ?? 0, hint: "Awaiting confirm" },
      { label: "Unsubscribed", value: stats?.unsubscribed ?? 0, hint: "Opted out" },
      { label: "Total", value: stats?.total ?? 0, hint: "All rows" },
      {
        label: "Confirm rate",
        value: `${stats?.confirmationRatePercent ?? 0}%`,
        hint: "Confirmed / (pending + confirmed)",
      },
      {
        label: "7d growth",
        value:
          stats?.growthPercent7d == null ? "—" : `${stats.growthPercent7d}%`,
        hint: "New confirms vs prior confirmed",
      },
    ],
    [stats]
  );

  function applyDraft(detail: DraftDetail) {
    setDraftId(detail.id);
    setDraftName(detail.name || "");
    setSubject(detail.subject || "");
    setIntroText(detail.introText || "");
    setBannerText(detail.bannerText || "");
    setHeaderImageUrl(detail.headerImageUrl || "");
    setFeaturedIds(Array.isArray(detail.essayIds) ? detail.essayIds : []);
    setPopularIds(
      Array.isArray(detail.popularEssayIds) ? detail.popularEssayIds : []
    );
    const subs = Array.isArray(detail.subscriberIds) ? detail.subscriberIds : [];
    setSelectedSubIds(subs);
    setTargetMode(subs.length > 0 ? "selected" : "all");
  }

  async function openDraft(id: number) {
    if (!token) return;
    try {
      const res = await fetch(newsletter_draft_url(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await readJson<DraftDetail & { error?: string } | null>(
        res,
        null
      );
      if (!res.ok || !body) {
        throw new Error(fromApiBody(body || {}, "Could not load draft"));
      }
      applyDraft(body);
      toast.success(`Loaded draft “${body.name}”`);
    } catch (e) {
      toast.error(errorMessage(e, "Could not load draft"));
    }
  }

  async function saveDraft() {
    if (!token) return;
    const name = draftName.trim();
    if (!name) {
      toast.error("Name this newsletter draft first");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name,
        subject: subject.trim() || null,
        introText: introText.trim() || null,
        bannerText: bannerText.trim() || null,
        headerImageUrl: headerImageUrl.trim() || null,
        essayIds: featuredIds,
        popularEssayIds: popularIds,
        subscriberIds: targetMode === "selected" ? selectedSubIds : [],
      };
      const res = await fetch(
        draftId ? newsletter_draft_url(draftId) : newsletter_drafts_url,
        {
          method: draftId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const body = await readJson<DraftDetail & { error?: string } | null>(
        res,
        null
      );
      if (!res.ok || !body) {
        throw new Error(fromApiBody(body || {}, "Could not save draft"));
      }
      setDraftId(body.id);
      setDraftName(body.name || name);
      toast.success(draftId ? "Draft updated" : "Draft saved");
      void loadDrafts();
    } catch (e) {
      toast.error(errorMessage(e, "Could not save draft"));
    } finally {
      setLoading(false);
    }
  }

  async function deleteDraft(id: number) {
    if (!token) return;
    const ok = await confirm({
      title: "Delete this draft?",
      description: "The draft is removed. Send history is not affected.",
      confirmLabel: "Delete draft",
      variant: "destructive",
    });
    if (!ok) return;
    try {
      const res = await fetch(newsletter_draft_url(id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await readJson<{ error?: string }>(res, {});
        throw new Error(fromApiBody(body, "Could not delete draft"));
      }
      if (draftId === id) {
        setDraftId(null);
      }
      toast.success("Draft deleted");
      void loadDrafts();
    } catch (e) {
      toast.error(errorMessage(e, "Could not delete draft"));
    }
  }

  async function runPreview() {
    if (!token || featuredIds.length === 0) {
      toast.error("Pick at least one essay to preview");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(newsletter_preview_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(composerBody()),
      });
      const body = await readJson<{
        html?: string;
        subject?: string;
        error?: string;
      }>(res, {});
      if (!res.ok) throw new Error(fromApiBody(body, "Preview failed"));
      setPreviewHtml(body.html || "");
      setPreviewSubject(body.subject || null);
    } catch (e) {
      toast.error(errorMessage(e, "Preview failed"));
    } finally {
      setLoading(false);
    }
  }

  async function sendToMyself() {
    if (!token || featuredIds.length === 0) {
      toast.error("Pick at least one essay first");
      return;
    }
    const ok = await confirm({
      title: "Send preview to yourself?",
      description: userEmail
        ? `Email this issue to ${userEmail}. Subscribers are not contacted.`
        : "Email this issue to your admin account. Subscribers are not contacted.",
      confirmLabel: "Send to me",
    });
    if (!ok) return;
    setLoading(true);
    try {
      const res = await fetch(newsletter_preview_send_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(composerBody()),
      });
      const body = await readJson<SendResult>(res, {});
      if (!res.ok) throw new Error(fromApiBody(body, "Preview send failed"));
      toast.success(body.message || "Preview sent");
      setLastResult(body);
    } catch (e) {
      toast.error(errorMessage(e, "Preview send failed"));
    } finally {
      setLoading(false);
    }
  }

  async function runSend(opts: { dryRun: boolean; schedule: boolean }) {
    if (!token || featuredIds.length === 0) {
      toast.error("Sign in and pick at least one essay");
      return;
    }
    if (targetMode === "selected" && selectedSubIds.length === 0) {
      toast.error("Select at least one subscriber, or switch to all confirmed");
      return;
    }

    let scheduledIso: string | undefined;
    if (opts.schedule) {
      if (!scheduleAt) {
        toast.error("Pick a schedule date and time");
        return;
      }
      const when = new Date(scheduleAt);
      if (Number.isNaN(when.getTime()) || when.getTime() <= Date.now() + 60_000) {
        toast.error("Schedule time must be at least 1 minute in the future");
        return;
      }
      scheduledIso = when.toISOString();
    }

    const audienceLine =
      targetMode === "selected"
        ? `${selectedSubIds.length} selected confirmed subscriber${selectedSubIds.length === 1 ? "" : "s"}`
        : `${sendToCount} confirmed subscriber${sendToCount === 1 ? "" : "s"}`;

    if (opts.dryRun) {
      const ok = await confirm({
        title: "Run a dry send?",
        description: `Simulate emailing this issue to ${audienceLine}. No messages leave the server.`,
        confirmLabel: "Dry run",
      });
      if (!ok) return;
    } else {
      const first = await confirm({
        title: opts.schedule
          ? "Schedule this newsletter?"
          : alreadySent && targetMode === "all"
            ? "Send this issue again?"
            : "Send newsletter now?",
        description: opts.schedule
          ? `Queue for ${new Date(scheduledIso!).toLocaleString()}. Sends to ${audienceLine}.`
          : `This will email ${audienceLine}. Publishing alone does not email anyone.`,
        confirmLabel: "Continue",
        variant: "destructive",
      });
      if (!first) return;
      const second = await confirm({
        title: "Final confirmation",
        description: `Confirm a real send to ${audienceLine}. This cannot be undone.`,
        confirmLabel: opts.schedule ? "Schedule send" : "Send now",
        variant: "destructive",
      });
      if (!second) return;
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
          ...composerBody(),
          dryRun: opts.dryRun,
          force: alreadySent && !opts.dryRun && targetMode === "all",
          confirmSend: !opts.dryRun,
          scheduledAt: opts.schedule ? scheduledIso : null,
        }),
      });
      const data = (await readJson<SendResult>(res, {})) as SendResult;
      if (!res.ok) {
        toast.error(data.error || "Send failed");
        setLastResult(data);
        return;
      }
      setLastResult(data);
      toast.success(
        data.message ||
          (opts.dryRun ? "Dry run done" : opts.schedule ? "Scheduled" : "Send done")
      );
      void loadEssays();
      void loadSends();
      void loadStats();
      if (data.sendLogId && !opts.dryRun && !opts.schedule) {
        void loadRecipients(data.sendLogId);
      }
    } catch (e) {
      toast.error(errorMessage(e, "Request failed"));
    } finally {
      setLoading(false);
    }
  }

  if (!isAdmin) {
    return (
      <p className='text-muted-foreground'>
        Admin sign-in required.{" "}
        <Link
          href='/login'
          className='text-brand underline-offset-4 hover:underline'
        >
          Login
        </Link>
      </p>
    );
  }

  return (
    <div className='flex flex-col gap-8'>
      <p className='text-sm text-muted-foreground'>
        Manage the list on{" "}
        <Link
          href='/admin/subscribers'
          className='font-semibold text-brand underline-offset-4 hover:underline'
        >
          Subscribers
        </Link>
        . Send logs and drafts are stored in the database.
      </p>

      {statsError ? (
        <p className='text-sm text-destructive' role='alert'>
          {statsError}
        </p>
      ) : null}

      {stats ? (
        <section aria-labelledby='sub-metrics'>
          <h2
            id='sub-metrics'
            className='font-display text-lg font-semibold mb-3'
          >
            Subscriber metrics
          </h2>
          <ul className='m-0 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-3 xl:grid-cols-6'>
            {metricCards.map((card) => (
              <li
                key={card.label}
                className='rounded-xl border border-border bg-card px-4 py-3'
              >
                <p className='text-xs uppercase tracking-wide text-muted-foreground'>
                  {card.label}
                </p>
                <p className='mt-1 font-display text-2xl font-semibold text-foreground'>
                  {card.value}
                </p>
                <p className='mt-1 text-xs text-muted-foreground'>{card.hint}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className='rounded-xl border border-border bg-card p-5 flex flex-col gap-3'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <h2 className='font-display text-lg font-semibold'>Saved drafts</h2>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => {
              setDraftId(null);
              setDraftName("");
              toast.message("Started a new draft in the composer");
            }}
          >
            New draft
          </Button>
        </div>
        <ul className='m-0 list-none divide-y divide-border p-0'>
          {drafts.map((d) => (
            <li
              key={d.id}
              className='flex flex-wrap items-center justify-between gap-3 py-3'
            >
              <div className='min-w-0'>
                <p className='font-medium text-foreground'>
                  {d.name}
                  {draftId === d.id ? (
                    <span className='ml-2 text-xs text-brand'>open</span>
                  ) : null}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {d.essayCount ?? 0} essays
                  {d.updatedAt
                    ? ` · updated ${new Date(d.updatedAt).toLocaleString()}`
                    : ""}
                  {d.bannerText ? ` · ${d.bannerText}` : ""}
                </p>
              </div>
              <div className='flex flex-wrap gap-2'>
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  onClick={() => void openDraft(d.id)}
                >
                  Continue
                </Button>
                <Button
                  type='button'
                  size='sm'
                  variant='ghost'
                  onClick={() => void deleteDraft(d.id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
          {drafts.length === 0 ? (
            <li className='py-3 text-sm text-muted-foreground'>
              No saved drafts yet. Name one below and click Save draft.
            </li>
          ) : null}
        </ul>
      </section>

      <section
        aria-live='polite'
        className='rounded-xl border border-brand/30 bg-brand/5 px-4 py-3'
      >
        <p className='text-sm font-semibold text-foreground'>
          This newsletter will be sent to {sendToCount} subscriber
          {sendToCount === 1 ? "" : "s"}
          {targetMode === "selected" ? " (selected)" : " (all confirmed)"}.
        </p>
      </section>

      <section className='flex flex-col gap-5 max-w-3xl'>
        <div className='grid gap-3 sm:grid-cols-2'>
          <div>
            <Label htmlFor='draft-name'>Draft name</Label>
            <Input
              id='draft-name'
              className='mt-1'
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder='e.g. April AI digest'
            />
          </div>
          <div>
            <Label htmlFor='subject'>Subject (optional)</Label>
            <Input
              id='subject'
              className='mt-1'
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder='Defaults to the first essay title'
            />
          </div>
        </div>

        <div>
          <Label htmlFor='banner'>Announcement banner (optional)</Label>
          <Input
            id='banner'
            className='mt-1'
            value={bannerText}
            onChange={(e) => setBannerText(e.target.value)}
            placeholder='e.g. New series starts this week'
            maxLength={500}
          />
        </div>

        <div>
          <Label>Header image (optional)</Label>
          <div className='mt-2'>
            <MediaPicker
              value={headerImageUrl}
              onSelect={setHeaderImageUrl}
              onCommit={setHeaderImageUrl}
              uploadFolder='newsletter'
              defaultPrefix='newsletter/'
              label='Newsletter header'
            />
          </div>
        </div>

        <div>
          <Label htmlFor='intro'>Intro</Label>
          <Textarea
            id='intro'
            className='mt-1 min-h-28'
            value={introText}
            onChange={(e) => setIntroText(e.target.value)}
            placeholder='Short note at the top of the email…'
            maxLength={4000}
          />
        </div>

        <div>
          <Label>Featured essays (max 5)</Label>
          <ul className='mt-2 m-0 max-h-56 list-none overflow-y-auto rounded-md border border-border p-2'>
            {essays.map((e) => {
              const checked = featuredIds.includes(e.id);
              return (
                <li key={e.id} className='py-1'>
                  <label className='flex cursor-pointer items-start gap-2 text-sm'>
                    <input
                      type='checkbox'
                      className='mt-1'
                      checked={checked}
                      onChange={() =>
                        setFeaturedIds((prev) => toggleId(prev, e.id, 5))
                      }
                    />
                    <span>
                      {essayLabel(e)}
                      <span className='text-muted-foreground'>
                        {" "}
                        #{e.id}
                        {e.newsletterSentAt ? " · emailed" : ""}
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <Label>Popular links (optional, max 5)</Label>
          <ul className='mt-2 m-0 max-h-44 list-none overflow-y-auto rounded-md border border-border p-2'>
            {essays.map((e) => {
              const checked = popularIds.includes(e.id);
              const disabled = featuredIds.includes(e.id);
              return (
                <li key={`pop-${e.id}`} className='py-1'>
                  <label
                    className={`flex items-start gap-2 text-sm ${
                      disabled ? "opacity-40" : "cursor-pointer"
                    }`}
                  >
                    <input
                      type='checkbox'
                      className='mt-1'
                      checked={checked}
                      disabled={disabled}
                      onChange={() =>
                        setPopularIds((prev) => toggleId(prev, e.id, 5))
                      }
                    />
                    <span>{essayLabel(e)}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        <div className='flex flex-col gap-2'>
          <Label>Recipients</Label>
          <div className='flex flex-wrap gap-4 text-sm'>
            <label className='inline-flex items-center gap-2'>
              <input
                type='radio'
                name='target'
                checked={targetMode === "all"}
                onChange={() => setTargetMode("all")}
              />
              All confirmed ({stats?.confirmed ?? 0})
            </label>
            <label className='inline-flex items-center gap-2'>
              <input
                type='radio'
                name='target'
                checked={targetMode === "selected"}
                onChange={() => setTargetMode("selected")}
              />
              Selected subscribers
            </label>
          </div>
          {targetMode === "selected" ? (
            <ul className='m-0 max-h-48 list-none overflow-y-auto rounded-md border border-border p-2'>
              {confirmedSubs.map((s) => {
                const checked = selectedSubIds.includes(s.id);
                return (
                  <li key={s.id} className='py-1'>
                    <label className='flex cursor-pointer items-center gap-2 text-sm'>
                      <input
                        type='checkbox'
                        checked={checked}
                        onChange={() =>
                          setSelectedSubIds((prev) => toggleId(prev, s.id, 100))
                        }
                      />
                      <span>{s.email}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>

        <div>
          <Label htmlFor='schedule-at'>Schedule (optional)</Label>
          <Input
            id='schedule-at'
            type='datetime-local'
            className='mt-1'
            value={scheduleAt}
            onChange={(e) => setScheduleAt(e.target.value)}
            min={toLocalInput(new Date(Date.now() + 120_000).toISOString())}
          />
        </div>

        <div className='flex flex-wrap gap-2'>
          <Button
            type='button'
            variant='secondary'
            disabled={loading || !draftName.trim()}
            onClick={() => void saveDraft()}
          >
            {draftId ? "Update draft" : "Save draft"}
          </Button>
          <Button
            type='button'
            variant='outline'
            disabled={loading || featuredIds.length === 0}
            onClick={() => void runPreview()}
          >
            Preview
          </Button>
          <Button
            type='button'
            variant='outline'
            disabled={loading || featuredIds.length === 0}
            onClick={() => void sendToMyself()}
          >
            Send to me
          </Button>
          <Button
            type='button'
            variant='outline'
            disabled={loading || featuredIds.length === 0}
            onClick={() => void runSend({ dryRun: true, schedule: false })}
          >
            Dry run
          </Button>
          <Button
            type='button'
            disabled={loading || featuredIds.length === 0 || sendToCount === 0}
            onClick={() => void runSend({ dryRun: false, schedule: false })}
          >
            {loading ? "Working…" : `Send to ${sendToCount}`}
          </Button>
          <Button
            type='button'
            variant='secondary'
            disabled={
              loading ||
              featuredIds.length === 0 ||
              !scheduleAt ||
              sendToCount === 0
            }
            onClick={() => void runSend({ dryRun: false, schedule: true })}
          >
            Schedule send
          </Button>
        </div>
      </section>

      {previewHtml != null ? (
        <section className='rounded-xl border border-border bg-card p-5 flex flex-col gap-3'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <h2 className='font-display text-lg font-semibold'>
              Preview{previewSubject ? `: ${previewSubject}` : ""}
            </h2>
            <Button
              type='button'
              size='sm'
              variant='ghost'
              onClick={() => {
                setPreviewHtml(null);
                setPreviewSubject(null);
              }}
            >
              Close
            </Button>
          </div>
          <iframe
            title='Newsletter preview'
            className='h-[32rem] w-full rounded-md border border-border bg-white'
            sandbox=''
            srcDoc={previewHtml}
          />
        </section>
      ) : null}

      {lastResult && (
        <section className='rounded-lg border border-border bg-secondary/30 p-4 text-sm max-w-3xl'>
          <p className='font-semibold mb-2'>Last result</p>
          <ul className='m-0 list-none space-y-1 p-0 text-muted-foreground'>
            {lastResult.message ? <li>{lastResult.message}</li> : null}
            {typeof lastResult.recipientCount === "number" ||
            typeof lastResult.confirmedCount === "number" ? (
              <li>
                Recipients:{" "}
                {lastResult.recipientCount ?? lastResult.confirmedCount}
              </li>
            ) : null}
            {typeof lastResult.wouldSend === "number" && (
              <li>Would send: {lastResult.wouldSend}</li>
            )}
            {typeof lastResult.sent === "number" && (
              <li>Sent: {lastResult.sent}</li>
            )}
            {lastResult.error ? (
              <li className='text-destructive'>{lastResult.error}</li>
            ) : null}
          </ul>
          {lastResult.previewRecipients &&
          lastResult.previewRecipients.length > 0 ? (
            <ul className='mt-3 m-0 max-h-40 list-none overflow-y-auto p-0 text-muted-foreground'>
              {lastResult.previewRecipients.map((email) => (
                <li key={email}>{email}</li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      <section className='rounded-xl border border-border bg-card p-5 flex flex-col gap-4'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <h2 className='font-display text-lg font-semibold'>
            Send history (database)
          </h2>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => void loadSends()}
          >
            Refresh
          </Button>
        </div>
        <ul className='m-0 list-none divide-y divide-border p-0'>
          {sends.map((s) => (
            <li
              key={s.id}
              className='flex flex-wrap items-center justify-between gap-3 py-3'
            >
              <div className='min-w-0'>
                <p className='font-medium text-foreground'>
                  {s.essayTitle || `Essay #${s.essayId}`}
                </p>
                <p className='text-xs text-muted-foreground'>
                  #{s.id} · {s.status}
                  {typeof s.recipientCount === "number"
                    ? ` · to ${s.recipientCount}`
                    : ""}
                  {typeof s.sentCount === "number"
                    ? ` · sent ${s.sentCount}`
                    : ""}
                </p>
              </div>
              <Button
                type='button'
                size='sm'
                variant='outline'
                onClick={() => void loadRecipients(s.id)}
              >
                View recipients
              </Button>
            </li>
          ))}
          {sends.length === 0 ? (
            <li className='py-4 text-sm text-muted-foreground'>
              No sends logged yet.
            </li>
          ) : null}
        </ul>
      </section>

      {selectedSendId != null ? (
        <section className='rounded-xl border border-border bg-card p-5'>
          <h2 className='font-display text-lg font-semibold mb-3'>
            Recipients for send #{selectedSendId} (read-only)
          </h2>
          {recipients.length === 0 ? (
            <p className='text-sm text-muted-foreground'>No recipient rows yet.</p>
          ) : (
            <ul className='m-0 max-h-80 list-none overflow-y-auto p-0 text-sm'>
              {recipients.map((r) => (
                <li
                  key={`${r.email}-${r.result}`}
                  className='flex justify-between gap-3 border-b border-border/60 py-1.5'
                >
                  <span>{r.email}</span>
                  <span className='text-muted-foreground'>{r.result}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}
    </div>
  );
}
