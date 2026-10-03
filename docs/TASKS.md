# Tasks

Source: `CURSOR_PROMPT.md` §6. Status: `todo` | `doing` | `done` | `blocked`.

GitHub issues: owner said no.

| ID | Phase | Title | Status | Branch / PR | Notes |
| --- | --- | --- | --- | --- | --- |
| P1-01 | 1 | Baseline audit | done | overhaul/p1-foundation | `docs/audit-baseline.md` + live headers 2026-10-04 |
| P1-02 | 1 | Revalidation on deploy and publish | done | overhaul/p1-foundation | `/api/revalidate` `all`; Spring `FrontendCacheRevalidator`; `npm run revalidate:all` |
| P1-03 | 1 | Keep shared layout static | done | overhaul/p1-foundation | `LoginLink` SSR `/login` only |
| P1-04 | 1 | One shared shell config | done | overhaul/p1-foundation | `lib/siteShell.ts`; Substack removed; Cobu naming aligned |
| P1-05 | 1 | Server-render every public route | done | overhaul/p1-foundation | Public RSC; HomeGate unused; verify-live checks Loading |
| P1-06 | 1 | Central metadata helper for all route types | done | overhaul/p1-foundation | `pageMeta` on essay + work + listings; no keywords |
| P1-07 | 1 | `scripts/verify-live.mjs` + npm + CI | done | overhaul/p1-foundation | `npm run verify:live`; `.github/workflows/verify-live.yml` |
| P2-01 | 2 | Remove cadence claims | todo | — | |
| P2-02 | 2 | Real dates only | todo | — | |
| P2-03 | 2 | Unfinished series labelled Planned | todo | — | |
| P2-04 | 2 | Single source for series and tags | todo | — | Owner: Opinion series? |
| P2-05 | 2 | Permanent URL rule + 301s | todo | — | |
| P2-06 | 2 | External/imported content policy | todo | — | Owner removing Substack stub |
| P2-07 | 2 | No foreign-hosted assets | todo | — | |
| P2-08 | 2 | Remove admin/developer voice | todo | — | |
| P2-09 | 2 | No duplicate blocks on a page | todo | — | Home Latest vs Start here |
| P2-10 | 2 | Remove meta-navigation fluff | todo | — | |
| P2-11 | 2 | Confidence copy (Cobu status) | todo | — | Owner wording |
| P2-12 | 2 | Copy lint in verify-live | todo | — | Partial bans already in verify-live |
| P3-01 | 3 | Subscribe flow end to end | todo | — | Partial work may exist; verify against checklist |
| P3-02 | 3 | One SubscribeForm + placements | todo | — | Component exists; audit placements |
| P3-03 | 3 | Form quality / honeypot | todo | — | |
| P3-04 | 3 | Welcome email with three essays | todo | — | |
| P3-05 | 3 | Analytics events | todo | — | |
| P3-06 | 3 | Long-form page anatomy | todo | — | |
| P3-07 | 3 | Reading layout typography | todo | — | |
| P3-08 | 3 | Related content | todo | — | Helper exists; verify UX |
| P3-09 | 3 | Series navigation | todo | — | |
| P3-10 | 3 | Listing cards and filters | todo | — | |
| P3-11 | 3 | Homepage rules | todo | — | |
| P3-12 | 3 | Site search | todo | — | |
| P3-13 | 3 | Topic hubs | todo | — | |
| P4-01 | 4 | Dynamic sitemap | todo | — | `/sitemap` exists; want `sitemap.ts` / indexable only |
| P4-02 | 4 | robots.ts | todo | — | |
| P4-03 | 4 | llms.txt | todo | — | Exists; tighten |
| P4-04 | 4 | JSON-LD per page type | todo | — | |
| P4-05 | 4 | RSS full text + lastBuildDate | todo | — | |
| P4-06 | 4 | writing-guide.md | todo | — | |
| P4-07 | 4 | Internal linking rules | todo | — | |
| P4-08 | 4 | Dynamic OG images | todo | — | |
| P4-09 | 4 | Search Console (owner) | blocked | — | Owner |
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

- Revalidate: code ready (`/api/revalidate` + Spring + `revalidate:all`). Run against prod after deploy.
- verify-live: script added. Expect FAIL on current production until this branch deploys (Blox OG inherit, SSR callbackUrl on some pages, banned phrases from stale HTML).
- Sample URLs: `/`, `/writing`, `/work/blox`, `/about`, `/for/clients` (re-check after deploy).
- Lighthouse: deferred until deploy (prod still mixed old/new HTML).
- Owner review: pending
- Owner decisions applied: no GitHub issues; remove Substack from footer Projects.
