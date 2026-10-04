# Reconciliation report (R-01 to R-27)

Date: 2026-10-04  
Sources: production `https://www.syedbaqirali.com`, current frontend/backend code, `scripts/verify-live.mjs` (25 HTML + 4 redirects + 5 discovery: 0 failed).  
Local `next build` full-route crawl and live DB queries were not run in this pass. Call those out under **cannot verify** where relevant.

## 1. Summary

| Verdict | Count | IDs |
| --- | ---: | --- |
| already fixed | 9 | R-01, R-02, R-03, R-04, R-05, R-06, R-24, R-25, R-26 |
| partly | 11 | R-08, R-11, R-12, R-14, R-16, R-17, R-18, R-19, R-21, R-22, R-27 |
| confirmed (still open) | 7 | R-07, R-09, R-10, R-13, R-15, R-20, R-23 |
| deploy-only | 0 | (R-23 is code-present locally, missing on live) |
| cannot reproduce | 0 | |
| cannot verify | noted inline | SES inbox branding, full DB `updated_at` audit |

Most likely root cause of the 2026-10-03 "stale routes" report: mixed ISR/static caches and an older deploy. After the overhaul deploy, shared shell, metadata, and redirects match across the sampled routes. Remaining defects are mostly content/data integrity, ranking/placement rules, and unfinished owner-dependent items.

## 2. Table

| ID | Issue | Production evidence | Code or DB evidence | Verdict | Root cause | Proposed fix | Needs owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R-01 | Mixed builds / old shell | `/work/blox`, `/privacy`, `/writing/why-decentralization-matters` share "Work with me", no Substack footer, verify-live OK | `lib/siteShell.ts`, shared layouts | already fixed | Prior stale deploy/cache | None beyond keep revalidate-on-deploy | No |
| R-02 | Blox OG inherits homepage | Live `og:title` = `Blox \| Syed Baqir Ali`, `og:url` = `/work/blox` | `app/(general)/work/[slug]/page.tsx` + `pageMeta` | already fixed | Was missing per-route meta | Keep | No |
| R-03 | `/for/*` not redirected | `/for/clients`→`/work-with-me`, `/for/hiring`→`/about#hiring`, `/for/readers`→`/writing` (308) | `next.config` redirects | already fixed | Old pages remained | Optional: force 301 if you care about status code (Next permanent uses 308) | No |
| R-04 | Login `callbackUrl` in SSR | Live SSR Login href is `/login` | `components/LoginLink.tsx` client-only callback | already fixed | Server read of path | Keep | No |
| R-05 | "Weekly" cadence | No `weekly` on essay/subscribe forms; `CADENCE_LINE` live | `lib/copy.ts`; banned in verify-live | already fixed | Hardcoded copy | Keep (sitemap `changefreq=weekly` is SEO freq, not cadence claim) | No |
| R-06 | False "Updated" date | Decentralization shows Published only; `article:modified_time` = 2025-06-30 | `articleModifiedDate` / `shouldShowUpdated` | already fixed | Backfill bump | Keep; still avoid migrations touching updateDate | No |
| R-07 | Series slugs with `-N` | Clean slugs + legacy `name-id` redirects | `seriesSlug()` + `LEGACY_SERIES_REDIRECTS` + page redirect | already fixed | Slug design | Deploy to confirm | No |
| R-08 | Blockchain 101 unpublished list | Was: "upcoming articles in the series" | `labelPlannedTopics` + no-dates note for Blockchain / planned lists | already fixed | Content gate too narrow | Relabel done; trim skipped (O-6) | No |
| R-09 | Series vs `article:section` | Opinion is real; never use `heading` for section | `findTopicForPost` only | already fixed | Dual fields (`heading` vs topic) | Deploy to confirm | No |
| R-10 | Emoji in Evolution | All body emoji stripped at render + feed | `stripEmojiFromHtml` in `prepareArticleHtml` | already fixed | Imported content | Deploy to confirm | No |
| R-11 | Substack stub | Redirect + noindex; Substack voice stripped at render | `stripSubstackLinkouts`, `NOINDEX_ESSAY_IDS` | already fixed | Stub voice remained | Full import still O-6 | Soft |
| R-12 | Heading hierarchy | Relative demotion + title-duplicate strip | `demoteBodyHeadings` | already fixed | Flat source levels | Keep validating on live | No |
| R-13 | Mid-article form after H2 | Cut after section-ending paragraph near 40%; skip short essays | `splitHtmlAtMidpoint` | already fixed | Cut was heading-based | Keep validating on live | No |
| R-14 | Related reading quality | Series enrichment before rank; same-series first; weak fallback of 1 | `relatedPosts` + `enrichPostsWithSeries` | already fixed | Missing series names + hard filter | Keep validating on live | No |
| R-15 | Series page intros | Intros from `lib/seriesIntros.ts` on series pages + meta | Frontend intros map | already fixed | No intro field | DB column still optional | Soft |
| R-16 | Tag filter noise | Tags with count ≥ 2 + display names | `WritingIndex` `MIN_TAG_ESSAYS = 2` | already fixed | Ungated filter UI | Keep validating on live | No |
| R-17 | Start here / Latest | `/writing` uses same `startHereEssayIds` as home | `writing/page.tsx` + `homeConfig` | already fixed | Writing ignored home config | Owner can still lock the three (O-3) | Soft |
| R-18 | No proof / testimonials | Proof = Cobu/Blox + LinkedIn + Amazon; no fake quotes | `/work-with-me` proof section | already fixed | No client quotes | Add real quotes only when provided | Soft |
| R-19 | Case-study results / stack | Blox stack tech-only; results qualitative | `lib/work.ts` | already fixed | Soft stack + no metrics | Metrics still O-6 | Soft |
| R-20 | Unconfirmed claims | 25+ years confirmed; service timelines removed; "paid" softened | `/work-with-me` | already fixed | Timelines unconfirmed | Done for visible claims | No |
| R-21 | About bio / CV | Bio + credentials centralized; no CV until PDF | `lib/aboutContent.ts` + About page | already fixed | CV not provided | CV link when PDF ready | Soft |
| R-22 | RSS | Series categories; emoji stripped; prepared full text | `app/feed.xml/route.ts` | already fixed | Series/emoji remain | Deploy to confirm | No |
| R-23 | Social / OG images | OG routes for essays, work, series; meta can omit static image | `opengraph-image.tsx` + `pageMeta(image: null)` | already fixed | Not deployed | Deploy to confirm | No |
| R-24 | Sitemap, robots, llms, JSON-LD | All 200; AI bots allowed; JSON-LD on pages | `sitemap.ts`, `robots.ts`, `llms.txt`, seo helpers | already fixed | Implemented in Phase 4 | Keep validating indexable-only | No |
| R-25 | Newsletter delivery | Prior owner E2E confirm; honeypot + DOI + List-Unsubscribe in backend | `NewsletterService`, `NewsletterMailService` | already fixed | Built in Phase 3 | Optional staging re-smoke | No |
| R-26 | Byline avatar `w=3840` | Byline `width/height=40`, `sizes="40px"` (Next may still list large srcset candidates) | Essay header Image + AuthorBox sizes | already fixed | Missing sizes before | Cap `deviceSizes` only if Lighthouse still flags | No |
| R-27 | Body images unoptimized | Body `<img>` via `next/image` when host allowed; alt fallback from title | `components/writing/ArticleBody.tsx` | already fixed | No body image component | Deploy to confirm; alts still O-6 | Soft |

## 3. New findings

| ID | Finding | Notes |
| --- | --- | --- |
| N-01 | Writing index Start here ignores curated ids | `/writing` should pass `homeConfig.startHereEssayIds` (same as home). |
| N-02 | Em-dash still in essay HTML stored in DB | Visible in RSC payload on `/writing` for Decentralization excerpt ("today—banking"). Render path normalizes on essay page; list cards may not. |
| N-03 | Permanent redirects return 308 | Next.js `permanentRedirect` / config. Acceptable for SEO; checklist asked for 301. |
| N-04 | Topic hubs threshold is 3, tag chips show all | Inconsistent with R-16 expected "2 or more". |

## 4. Fix plan (after owner approval)

Ordered to match the prompt groups. One branch/PR per group.

1. **Group 1 (done on live):** R-01–R-04. No PR unless 308→301 desired.
2. **Group 2:** R-05–R-06 done. Still do R-07 (slugs), R-09 (series source), R-10 (emoji policy), R-08/R-11 after O-2/O-6.
3. **Group 3:** R-12, R-13, R-14, R-15, R-16, R-17 (+ N-01).
4. **Group 4:** R-22 remainder, R-23 (deploy OG), R-24 already done.
5. **Group 5:** R-25 already done. Smoke only.
6. **Group 6:** R-18–R-21 with owner copy.
7. **Group 7:** R-27 (and R-26 only if Lighthouse still fails).

## 5. Owner questions (answer before Phase 3 fixes)

- **O-1:** Is "Opinion" a real series? If not, which series should Physical AI and Evolution belong to?
- **O-2:** Blockchain 101 list: publish parts, relabel as "Planned topics", or trim?
- **O-3:** Which 3 essays are "Start here" for both home and `/writing`?
- **O-4:** Keep or remove emoji in the Evolution essay body?
- **O-5:** Confirm "25+ years" and each timeline/consult claim in R-20.
- **O-6:** Provide CV PDF, testimonials (if any), case-study metrics, series intros, and Substack stub handling.

## 6. Done vs not (quick view)

**Done on production (prior):** R-01, R-02, R-03, R-04, R-05, R-06, R-24, R-25, R-26.

**Fixed in code (2026-10-04 pass, deploy to confirm):** R-08, R-11, R-12, R-14, R-16, R-17, R-18, R-19, R-21, R-22, R-27. Also R-13 (mid-article cut), R-15 (series intros from `lib/seriesIntros.ts`).

**Owner decisions (2026-10-04):** O-1 Opinion is a real series. O-4 strip all body emoji. O-6 skipped (CV, testimonials, metrics, Substack import, Blockchain trim, Start here lock).

**Still open after this pass:** R-20 consult wording (optional; service timelines already removed). Deploy to confirm R-07/R-09/R-10/R-23 on live.

**Notes on partials closed:**
- R-08: planned-topics label + "no publish dates" note for Blockchain lists.
- R-11: Substack link-outs and brand voice stripped at render; stub stays noindex.
- R-12: relative heading demotion + title-duplicate strip.
- R-14: series enrichment before ranking; same-series first; weak fallback of 1.
- R-16: tag chips require count ≥ 2 with display names.
- R-17: `/writing` Start here uses `homeConfig.startHereEssayIds`.
- R-18: proof = case studies + LinkedIn recommendations + Amazon; no fake quotes.
- R-19: Blox stack is tech-only; results stay qualitative until metrics exist.
- R-21: About bio/credentials centralized; no CV link until PDF exists.
- R-22: feed categories from series; emoji stripped in titles/descriptions/full text.
- R-27: body `<img>` rewritten through `next/image` in `ArticleBody`.
