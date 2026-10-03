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
| P4-09 | 4 | Search Console (owner) | blocked | — | Owner: submit `/sitemap.xml` after deploy |
| P5-01 | 5 | Clients primary CTA | todo | — | |
| P5-02 | 5 | Outcome-led services | todo | — | |
| P5-03 | 5 | Case-study template | todo | — | TODO(owner): metrics |
| P5-04 | 5 | Show every project consistently | todo | — | |
| P5-05 | 5 | Proof / testimonials | blocked | — | TODO(owner) |
| P5-06 | 5 | Contact spam protection | todo | — | |
| P5-07 | 5 | Optional service pages | todo | — | Owner confirm |
| P6-01 | 6 | About bio and credentials | todo | — | Admin about exists; public copy TODO(owner) |
| P6-02 | 6 | CV + hiring section | blocked | — | TODO(owner): CV PDF |
| P6-03 | 6 | Simplify nav; retire /for/* | todo | — | |
| P7-01 | 7 | Image sizes and alts | todo | — | |
| P7-02 | 7 | CloudFront | blocked | — | TODO(owner) |
| P7-03 | 7 | Perf targets | todo | — | |
| P7-04 | 7 | Accessibility | todo | — | |
| P7-05 | 7 | Security headers | todo | — | |
| P7-06 | 7 | Docker HEALTHCHECK | todo | — | |
| P8-01 | 8 | Privacy page matches reality | todo | — | |
| P8-02 | 8 | Uptime / errors | todo | — | |
| P8-03 | 8 | Admin subscriber metrics | todo | — | |
| P8-04 | 8 | Post-deploy checklist automation | todo | — | |

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

- Branch: `overhaul/p4-discoverability` (local; not deployed yet).
- `app/sitemap.ts` + legacy `/sitemap`; `app/robots.ts`; llms essays+deks; RSS; JSON-LD; next/og; writing-guide.
- Owner: P4-09 submit `https://www.syedbaqirali.com/sitemap.xml` in Search Console after deploy.
