# Tasks

Source: `CURSOR_PROMPT.md` §6. Status: `todo` | `doing` | `done` | `blocked`.

GitHub issues: owner said no.

| ID | Phase | Title | Status | Branch / PR | Notes |
| --- | --- | --- | --- | --- | --- |
| P1-01 | 1 | Baseline audit | done | overhaul/p1-foundation | Live verified 2026-10-04 |
| P1-02 | 1 | Revalidation on deploy and publish | done | overhaul/p1-foundation | Secret required (401 without it) |
| P1-03 | 1 | Keep shared layout static | done | overhaul/p1-foundation | |
| P1-04 | 1 | One shared shell config | done | overhaul/p1-foundation | |
| P1-05 | 1 | Server-render every public route | done | overhaul/p1-foundation | |
| P1-06 | 1 | Central metadata helper for all route types | done | overhaul/p1-foundation | |
| P1-07 | 1 | `scripts/verify-live.mjs` + npm + CI | done | overhaul/p1-foundation | 26/26 OK post-deploy |
| P2-01 | 2 | Remove cadence claims | done | overhaul/p2-trust | `lib/copy.ts` `CADENCE_LINE` |
| P2-02 | 2 | Real dates only | done | overhaul/p2-trust | `shouldShowUpdated` / backfill guard already in place |
| P2-03 | 2 | Unfinished series labelled Planned | done | overhaul/p2-trust | SeriesNav live-only; Planned labels in essay body; unpublished rows only if API exposes them |
| P2-04 | 2 | Single source for series and tags | done | overhaul/p2-trust | Owner: keep Opinion for now; may retire later |
| P2-05 | 2 | Permanent URL rule + 301s | done | overhaul/p2-trust | Slug + legacy redirects already in `lib/articles` |
| P2-06 | 2 | External/imported content policy | done | overhaul/p2-trust | Stub id=19 `noindex`, out of sitemap/feed; learning sidebar Substack link removed |
| P2-07 | 2 | No foreign-hosted assets | done | overhaul/p2-trust | Essay images on `sbaweb-bucket`; no Substack hosts in API |
| P2-08 | 2 | Remove admin/developer voice | done | overhaul/p2-trust | StartHere blurb fixed |
| P2-09 | 2 | No duplicate blocks on a page | done | overhaul/p2-trust | Latest excludes Start here ids |
| P2-10 | 2 | Remove meta-navigation fluff | done | overhaul/p2-trust | Not present on live public pages |
| P2-11 | 2 | Confidence copy (Cobu status) | done | overhaul/p2-trust | "in active development"; sanitizes API copy |
| P2-12 | 2 | Copy lint in verify-live | done | overhaul/p2-trust | Banned + dash checks always on; HTML dash normalize |
| P3-01 | 3 | Subscribe flow end to end | done | overhaul/p3-readers | Owner verified submit/confirm/unsubscribe |
| P3-02 | 3 | One SubscribeForm + placements | done | overhaul/p3-readers | hero/inline/end; series + case study |
| P3-03 | 3 | Form quality / honeypot | done | overhaul/p3-readers | |
| P3-04 | 3 | Welcome email with three essays | done | overhaul/p3-content-ops | Uses Start here ids; deploy backend to activate |
| P3-05 | 3 | Analytics events | done | overhaul/p3-readers | GA4: subscribe, confirm, contact, essay_read_50, book call |
| P3-06 | 3 | Long-form page anatomy | done | overhaul/p3-readers | Essay + case study end blocks aligned |
| P3-07 | 3 | Reading layout typography | done | overhaul/p3-readers | 18px / 1.65 / ~65ch + code styles |
| P3-08 | 3 | Related content | done | overhaul/p3-readers | Series/tags only; skip weak matches |
| P3-09 | 3 | Series navigation | done | overhaul/p3-readers | Live-only prev/next; landing + subscribe |
| P3-10 | 3 | Listing cards and filters | done | overhaul/p3-readers | Cards + filters; paginate above 20 |
| P3-11 | 3 | Homepage rules | done | overhaul/p3-readers | Subscribe primary; Latest vs Start here deduped |
| P3-12 | 3 | Site search | done | overhaul/p3-readers | MySQL FULLTEXT + LIKE fallback; `/writing?query=` server search |
| P3-13 | 3 | Topic hubs | done | overhaul/p3-readers | `/writing/topics` + `[tag]` when count >= 3 |
| P4-01 | 4 | Dynamic sitemap | done | overhaul/p4-discoverability | `app/sitemap.ts` + `/sitemap` alias; lastModified from content |
| P4-02 | 4 | robots.ts | done | overhaul/p4-discoverability | Metadata route; AI crawlers allowed |
| P4-03 | 4 | llms.txt | done | overhaul/p4-discoverability | Essays + deks; sitemap.xml pointer |
| P4-04 | 4 | JSON-LD per page type | done | overhaul/p4-discoverability | Person, WebSite, BlogPosting, Breadcrumb, ProfessionalService, project |
| P4-05 | 4 | RSS full text + lastBuildDate | done | overhaul/p4-discoverability | content:encoded + hourly revalidate |
| P4-06 | 4 | writing-guide.md | done | overhaul/p4-discoverability | |
| P4-07 | 4 | Internal linking rules | done | overhaul/p4-discoverability | Breadcrumbs + matching JSON-LD on essay/series/topic/work |
| P4-08 | 4 | Dynamic OG images | done | overhaul/p4-discoverability | next/og for essays + case studies |
| P4-09 | 4 | Search Console (owner) | done | — | Owner confirmed site already in Search Console |
| P5-01 | 5 | Clients primary CTA | done | overhaul/p5-through-p8 | `/work-with-me` hero: Calendly + Contact |
| P5-02 | 5 | Outcome-led services | done | overhaul/p5-through-p8 | who / problem / deliver / timeline |
| P5-03 | 5 | Case-study template | done | overhaul/p5-through-p8 | Qualitative showcase outcomes; Blox stack updated |
| P5-04 | 5 | Show every project consistently | done | overhaul/p5-through-p8 | Home lists Cobu + Blox with result lines |
| P5-05 | 5 | Proof / testimonials | done | overhaul/p5-through-p8 | Manning reviewer + Amazon co-author; no fake client quotes |
| P5-06 | 5 | Contact spam protection | done | overhaul/p5-through-p8 | Honeypot, rate limit, optional Turnstile, obfuscated email |
| P5-07 | 5 | Optional service pages | blocked | — | Blocked until each service has real content |
| P6-01 | 6 | About bio and credentials | done | overhaul/p5-through-p8 | Teaching section; no visitor TODOs |
| P6-02 | 6 | CV + hiring section | blocked | — | Blocked until CV PDF is available; `#hiring` uses LinkedIn + contact |
| P6-03 | 6 | Simplify nav; retire /for/* | done | overhaul/p5-through-p8 | Nav + 301s to work-with-me / about#hiring / writing |
| P7-01 | 7 | Image sizes and alts | done | overhaul/p5-through-p8 | Sidebar alts/sizes; about alt |
| P7-02 | 7 | CloudFront | blocked | — | TODO(owner) |
| P7-03 | 7 | Perf targets | done | overhaul/p5-through-p8 | Documented in post-deploy / Lighthouse optional |
| P7-04 | 7 | Accessibility | done | overhaul/p5-through-p8 | Existing skip/focus/reduced-motion kept |
| P7-05 | 7 | Security headers | done | overhaul/p5-through-p8 | HSTS, XCTO, Referrer, CSP in next.config |
| P7-06 | 7 | Docker HEALTHCHECK | done | overhaul/p5-through-p8 | FE Dockerfile + BE actuator already |
| P8-01 | 8 | Privacy page matches reality | done | overhaul/p5-through-p8 | Contact reason, newsletter DOI, GA4/Vercel/AdSense |
| P8-02 | 8 | Uptime / errors | blocked | — | Owner: see `docs/ops-monitoring.md` |
| P8-03 | 8 | Admin subscriber metrics | done | overhaul/p5-through-p8 | `/secure/newsletter/v1/stats` + admin UI |
| P8-04 | 8 | Post-deploy checklist automation | done | overhaul/p5-through-p8 | `npm run post-deploy` |
| BL-01 | backlog | Branded HTML email shell (SES) | done | overhaul/p5-through-p8 | Shared HTML shell + CTA buttons; plain-text kept |
| BL-02 | backlog | Simplify offers for readers/clients | done | overhaul/p5-through-p8 | Offer summary, credentials, related work per service, get-in-touch |
| BL-03 | backlog | Per-service pages | blocked | — | Same as P5-07; unblock when service pages have real content |
| BL-04 | backlog | Teaching / workshops revenue | done | — | Half-day workshop offer on `/work-with-me` |
| BL-05 | backlog | Essay view counts | done | — | `/essays/v1/{id}/view` + stats; 12h visitor dedupe |
| BL-06 | backlog | Engagement signals | done | — | Clap once per visitor; shown on essay pages |
| BL-07 | backlog | Popular ranking from views | done | — | Popular strip prefers `/essays/v1/popular` then curated fallback |

## Phase verification log

### Phase 1

- Revalidate: secret is set (unauthenticated POST returns 401). Owner can run `REVALIDATE_SECRET=... npm run revalidate:all` after deploys; Spring publish hook uses the same secret.
- verify-live (2026-10-04 post-deploy): **26/26 OK** (phase-1 checks).
- Sample URLs: `/work/blox` og:title/url/description are page-specific; SSR Login is `/login`.
- Lighthouse: not required to close P1; optional later.
- Owner review: verified live; proceeding to Phase 2.
- Owner decisions applied: no GitHub issues; remove Substack from footer Projects.

### Phase 2

- Deployed with `overhaul/p3-readers` + backend (2026-10-04).
- verify-live: **26/26 OK** (dash entities normalized).
- Opinion series: keep for now.

### Phase 3

- Deployed mid-phase (welcome email, anatomy, analytics). verify-live **26/26 OK**.
- P3-12/13 coded locally: FULLTEXT search bootstrap + `/writing/topics` hubs (need FE+BE deploy).
- Topic hubs only list tags/series labels with 3+ essays; currently may be empty until more tagged content.
- Series + topic hub lists now use shared `PaginatedEssayList` (20/page).

### Phase 4

- Deployed `overhaul/p4-discoverability` (2026-10-04).
- verify-live: **27 HTML + 5 discovery OK** (sitemap.xml, sitemap, robots, feed, llms).
- Owner remaining: P4-09 submit `https://www.syedbaqirali.com/sitemap.xml` in Search Console.

### Ops notes

- SES production access enabled (2026-10-04): confirm/welcome/essay mail can reach any recipient (not sandbox-only). Still confirm SPF/DKIM/DMARC if not already set.
- Essay save/publish never emails subscribers. Blasts are admin-only; `newsletter_sent_at` tracks sends and blocks accidental resend unless force.

### Phases 5 to 8 (coded, pending deploy)

- Branch FE: `overhaul/p5-through-p8`. BE: `overhaul/p3-content-ops` (newsletter from-name, no auto-send, contact Turnstile, stats).
- Owner after deploy: P4-09 Search Console; P5-05 testimonials; P6-02 CV; P7-02 CloudFront; P8-02 UptimeRobot/Sentry; optional Turnstile keys; confirm 24h reply copy if desired.
- Deploy both FE + BE together, then `npm run post-deploy`.

### Newsletter ops (overhaul/next, hardened for deploy)

- Admin: `/admin/subscribers`, composer (intro, essays, popular links, header/banner), drafts, preview, schedule, targeted send, send-to-self, horizontal metrics (Recharts).
- Public: growth/rounded audience signal; self-send essay links via confirm email (HMAC token, rate limited, generic responses).
- Backend: send logs + `payload_json`, drafts table, scheduler, header URL sanitize (https or site-relative only).
- Hardening checks: newsletter unit tests green; FE typecheck/lint clean of errors. Deploy FE+BE from `overhaul/next` then `npm run post-deploy`.
- Next after deploy: reader accounts + moderated comments MVP (separate from newsletter subscribers).
