# Cursor Prompt: Verify, Reconcile, Then Fix (syedbaqirali.com)

## 1. Your job

An external review of the live site found 27 open issues (IDs R-01 to R-27 in `CHECKLIST.md`). Some may already be fixed in your code and just not live yet. Some may be real defects. Do not assume either.

Work in four phases, in order:

1. **Verify.** For every item, check production, the code, and the database. Change no application code in this phase. You may add the verification script and write reports.
2. **Reconcile.** Write `docs/reconciliation-report.md` (format in section 5). Then **stop** and present a short summary. Wait for the owner to approve the fix plan and answer the owner questions.
3. **Fix.** Fix confirmed issues in the order in section 7. One branch and PR per group. Fix at the template, data, or pipeline level, never on a single page.
4. **Re-verify.** Run the verification script against a fresh render. Write `docs/final-report.md` (before and after per ID). Update `CHECKLIST.md`.

## 2. Rules

- Never invent facts: metrics, testimonials, dates, credentials, client names. Use `TODO(owner): <what is needed>`.
- Decisions that change public claims, content, or cost go to the owner. Do not decide them.
- No em-dashes or en-dashes in any visitor-facing text, code comment, or doc.
- No paid third-party services. Free tiers and AWS services already in use are allowed.
- Never delete data. Migrations keep legacy values (for example `legacy_slug`).
- Small commits named by ID, for example `R-07: descriptive series slugs`.
- Every fix gets a regression check in `scripts/verify-live.mjs` or a unit test.

## 3. Context

- Stack: Next.js (App Router), Spring Boot API, MySQL on AWS RDS, EC2 with Docker.
- Audience priority: 1) readers, 2) clients, 3) hiring managers. Primary conversion: email subscribers.
- Reference pages that are already correct (use them as the target):
  - Essay: `/writing/attention-bert-gpt-transformers-nlp`
  - Project page: `/work/cobu`
  - Static page: `/work-with-me`, `/contact`, `/subscribe`, homepage
- Known stale or wrong in production on 2026-10-03: `/work/blox`, `/writing/why-decentralization-matters`, `/privacy`, `/for/clients`, `/feed.xml`.

## 4. How to verify (do all of this in Phase 1)

1. **Local truth.** Run `next build && next start` against the current branch with production-like env. Fetch every route locally. This shows what the code produces without any cache.
2. **Production snapshot.** For every URL in the route list, run `curl -s -D - <url>` and save headers and body to `docs/evidence/`. Record: status, `cache-control`, `x-nextjs-cache`, `age`, any CDN cache header, and `last-modified`.
3. **Compare.** If local is correct and production is wrong, the cause is cache or deployment. If local is also wrong, the cause is code or data. Record which.
4. **Layouts.** List every layout, footer, and header component. Find routes that use a different or legacy shell.
5. **Database.** Query the posts, series, and tags tables for the fields named in each item.
6. **Search the repo and content** for the strings named in each item (`weekly`, `/for/clients`, `callbackUrl`, emoji ranges, `Substack`).
7. **Create `scripts/verify-live.mjs <base-url>`** (it will be reused in Phase 4). For every URL it checks: status 200, no redirect chains, unique title and description, canonical equals `og:url`, exactly one H1, no "Loading" in HTML, no banned phrases (`weekly`, `Read more`, `Wrong path`), no em-dash or en-dash in visible text, heading levels never skip, JSON-LD parses when present.
8. If you cannot verify something (for example the production CDN), say so in the report. Do not guess.

Route list to cover: `/`, `/writing`, every essay, `/writing/series`, every series page, `/work`, `/work/cobu`, `/work/blox`, `/work-with-me`, `/about`, `/subscribe`, `/contact`, `/privacy`, `/for/clients`, `/for/hiring`, `/for/readers`, `/feed.xml`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, and the Substack stub essay (old slug `understanding-ai-fundamentals-19`, if it still exists).

## 5. Reconciliation report format

Write `docs/reconciliation-report.md` with:

1. **Summary:** counts per verdict, and the single most likely root cause for the stale pages.
2. **Table**, one row per ID: `ID | Issue | Production evidence (URL, command, header or snippet) | Code or DB evidence (file and line, or query and result) | Verdict | Root cause | Proposed fix | Needs owner input`.
3. **Verdict values:** `confirmed` (defect in code or data), `deploy-only` (correct locally, stale in production), `already fixed` (correct in both), `cannot reproduce`, `partly`, `cannot verify` (say why).
4. **New findings:** anything you found that is not in the list. Give each a new ID (`N-01`, `N-02`, ...).
5. **Fix plan:** ordered list, grouped by PR, with estimated risk and any migration.
6. **Owner questions:** the open decisions from section 8.

Stop after the report. Do not start Phase 3 until the owner replies.

## 6. The issues (details, verification, and fix guidance)

Each item lists what was observed on 2026-10-03, how to verify, the expected end state, and a fix direction.

### Build and routing

**R-01 Mixed builds across routes.**
- Observed: Homepage, `/writing`, `/about`, `/work-with-me`, `/work/cobu`, and the Attention and Evolution essays are new. `/work/blox` still has the old footer (Projects shows "Cobu: AI RAG Agent" and a Substack blog link, no "Work with me" nav item) and its CTA "Work with me" links to `/for/clients`. `/writing/why-decentralization-matters`, `/privacy`, `/for/clients`, and `/feed.xml` are also old. `/privacy` has a footer without "Work with me" and no Projects block.
- Verify: local build vs production headers (section 4). Check whether stale routes use a different layout or footer component, or are static or ISR with old cache.
- Expected: every route uses one shared shell (header, footer, Projects list, social links) from a single config. After deploy, all routes show the same build.
- Fix: one shared layout and one footer config. Revalidate all routes on deploy and on publish (`revalidatePath` or tags, plus a protected `/api/revalidate` that Spring Boot calls). Set explicit `revalidate` times. Document the post-deploy step.

**R-02 Blox metadata inherits homepage social tags.**
- Observed: `/work/blox` has `og:title` "Syed Baqir Ali | Practical Writing on AI and Software", `og:url` the homepage, and the homepage `og:description`. `/work/cobu` is correct.
- Verify: diff the metadata code for the two project routes.
- Expected: every project route sets its own title, description, canonical, `og:title`, `og:url`, and `og:description`.
- Fix: one metadata helper for all project and content routes. Remove per-route overrides that skip fields.

**R-03 Old `/for/*` pages not redirected.**
- Observed: `/for/clients` is live with the old copy, four buttons, "Wrong path?", a LinkedIn discovery URL, Linktree, and the homepage's `og:url`. `/work-with-me` is the replacement. `/for/hiring` and `/for/readers` could not be fetched.
- Verify: check whether each `/for/*` route exists in code and what it returns.
- Expected: `/for/clients` to `/work-with-me`, `/for/hiring` to `/about#hiring`, `/for/readers` to `/writing`, each a single 301. Internal links updated. No old page remains indexable.
- Fix: redirects in `next.config`. Update internal links (for example the Blox CTA).

**R-04 Per-request personalization makes pages dynamic.**
- Observed: some pages render the footer Login link as `/login?callbackUrl=%2Fwork%2Fblox`. Others use plain `/login`. This suggests the layout reads the request path or headers.
- Verify: grep for `headers()`, `cookies()`, `usePathname` in server layouts, and the `callbackUrl` construction.
- Expected: the public layout is static. Login is a plain link or the callback is resolved on the client.
- Fix: remove request-dependent reads from shared server components.

### Trust and accuracy

**R-05 "Weekly" claim remains.**
- Observed: the Decentralization essay form says "New essays weekly. Unsubscribe anytime." Everything else says "New essays as they publish."
- Verify: grep the repo, templates, and DB content for `weekly` (case-insensitive).
- Expected: one copy constant, used by every form and page: "New essays as they publish."
- Fix: replace with the constant. Add `weekly` to the banned phrases in `verify-live.mjs`.

**R-06 False "Updated" date.**
- Observed: Decentralization shows "Updated Oct 2, 2026" and `article:modified_time` 2026-10-02T03:28:10Z. Other essays show only their published date. The essay was not edited that day.
- Verify: query `updated_at` for all posts. Find the migration or job that touched it.
- Expected: `updated_at` reflects real content edits. UI shows "Updated" only when the content changed after publish.
- Fix: correct the data (set to the published date unless the owner knows the real edit date). Ensure migrations and backfills never bump `updated_at`. Use a separate `content_updated_at` if needed.

**R-07 Series slugs have numeric suffixes.**
- Observed: `/writing/series/deep-learning-1`, `nlp-3`, `rust-4`, `blockchain-5`, `opinion-99`.
- Verify: check the series table and how slugs are generated.
- Expected: descriptive slugs (`deep-learning`, `nlp`, `rust`, `blockchain`) with unique constraints. Old URLs return one 301.
- Fix: migration with `legacy_slug`, redirects, updated internal links, sitemap, and breadcrumbs.

**R-08 Blockchain 101 promises 19 unpublished parts.**
- Observed: the Decentralization essay lists 20 topics under "Here are the upcoming articles in the series", with no dates or links.
- Verify: find the list in the post body.
- Expected: owner decision (see O-2). Default: relabel as "Planned topics" and make clear no dates are promised, or trim to the published item.
- Fix: edit the content after the owner decides. Do not delete the list without approval.

**R-09 Series and section disagree.**
- Observed: the Evolution essay shows `article:section` "Deep Learning" and RSS category "Deep Learning", but the page's "Series: Opinion" and the writing index list it under Opinion.
- Verify: inspect the posts, series, and tags tables and how each output (page label, meta, RSS, index) reads them.
- Expected: one source of truth. Series chip counts, series pages, essay labels, `article:section`, and RSS categories all agree.
- Fix: compute all of them from the series field. Owner decides whether "Opinion" is a series (O-1).

**R-10 Emoji in Evolution essay.**
- Observed: the body has an emoji-heavy heading and emoji after many paragraphs. The RSS description includes them. The title is already clean.
- Verify: scan all posts for emoji (Unicode ranges) in titles, headings, and body.
- Expected: no emoji in titles, headings, deks, meta, or RSS. Body emoji per owner decision (O-4).
- Fix: strip from headings, deks, meta, and RSS descriptions in code. Edit the body only after the owner decides.

**R-11 Substack stub essay.**
- Observed: previously a link-out stub (old slug `understanding-ai-fundamentals-19`), indexable, with a Substack-hosted image. It no longer appears in lists. The page itself could not be re-fetched.
- Verify: request the URL, check the robots meta, the sitemap, the feed, and the DB row.
- Expected: either full text imported, or `noindex`, excluded from sitemap and feed, and no external-hosted image.
- Fix: set `noindex` and exclude by default. Ask the owner for the full text.

### Reader and subscriber experience

**R-12 Heading hierarchy.**
- Observed: on updated essays all body headings render as H2 (for example Evolution: "AI as a Transformative Force" and "Reshaping Human Cognition" are both H2). The first body heading repeats the essay title ("The Evolution of Artificial Intelligence: Augmenting and Transforming Collective Intelligence" under the page H1).
- Verify: parse the rendered headings for every essay. Compare to the source markdown levels.
- Expected: exactly one H1 (the title). Body headings demoted by one level while preserving relative hierarchy (source H1 to H2, source H2 to H3). A first body heading that repeats the title is removed. Levels never skip.
- Fix: normalize at render time. Add the rule to `verify-live.mjs`.

**R-13 Mid-article form placement.**
- Observed: on the Evolution essay the subscribe block sits directly under the H2 "Augmented Collective Intelligence: Enhancing Human Cognition", separating the heading from its text.
- Verify: find the insertion logic.
- Expected: insert after a paragraph that ends a section, at about 40 percent of the body by word count, never immediately after a heading, and skip essays under about 400 words.
- Fix: update the insertion rule.

**R-14 Related reading.**
- Observed: Decentralization (and earlier Rust) list unrelated items. Attention correctly shows only "NLP Primer".
- Verify: after R-01, recheck every essay.
- Expected: rank by same series, then shared tags, then recency. Exclude the current essay. Show fewer than 3 if fewer are relevant.
- Fix: apply one ranking function everywhere.

**R-15 Series pages have no intro.**
- Observed: `/writing/series/nlp-3` shows only a title, count, and list. Meta description is generic ("Essays in the NLP series by Syed Baqir Ali.").
- Verify: check for an `intro` field.
- Expected: each series has a short intro (2 to 3 sentences) shown above the list and used as the meta description.
- Fix: add an `intro` column and render it. `TODO(owner)` for the text.

**R-16 Tag filter noise.**
- Observed: the writing index lists 14 raw lowercase tags (`ai`, `attention`, `physical-ai`, ...), most used once.
- Verify: count essays per tag.
- Expected: show only tags used by 2 or more essays, with display names. Hide the filter if none qualify.
- Fix: filter and display-name map.

**R-17 "Start here" and "Latest".**
- Observed: `/writing` "Start here" shows Decentralization, Attention, and Rust, which are also the first three in the chronological list below. The homepage "Start here" is a different set (Physical AI, NLP Primer, Rust). The homepage "Latest essays" shows only 2 items.
- Verify: find how each block selects items.
- Expected: one curated source (a `start_here_order` field or config) used by both pages. The owner picks 3 (O-3). Homepage "Latest" shows 3.
- Fix: implement the curated field and the "Latest" count.

### Clients and hiring managers

**R-18 No proof block.**
- Observed: `/work-with-me` has services and credentials but no testimonials or recommendations.
- Expected: a proof section with real testimonials or LinkedIn recommendations.
- Fix: build the component with `TODO(owner)` placeholders. Do not invent quotes.

**R-19 Case-study results.**
- Observed: Cobu and Blox "Result" lines restate the summary. There are no metrics. Blox "Stack" reads "Product design, Full-stack web, Habit & goals UX, Iterative shipping". `/work-with-me` already lists the real stack as "React · Next.js · Spring Boot · MySQL".
- Expected: "Result" is measurable or says `TODO(owner): metric`. "Stack" lists technologies only.
- Fix: update Blox stack from the `/work-with-me` data. Add result placeholders.

**R-20 Unconfirmed claims.**
- Observed on `/work-with-me`: "A paid 30 minute consultation", "Typical thin slice: 2 to 6 weeks", "Pipeline foundations often land in 1 to 3 weeks", "Discovery in days", "Pilot in weeks".
- Expected: the owner confirms each claim (O-5).
- Fix: mark each with a `TODO(owner): confirm` comment in code. Do not change visible text until the owner answers.

**R-21 About page.**
- Observed: credentials and a hiring section exist. There is no CV download, no narrative bio, and "25+ years in SWE and AI" appears on About and `/work-with-me` (and in service credentials).
- Expected: one credentials config feeds About, `/work-with-me`, and structured data. A short bio and a CV link (`TODO(owner): CV PDF`).
- Fix: centralize credentials. Add the CV slot and bio section.

### Search and AI

**R-22 RSS.**
- Observed: `lastBuildDate` is stuck at "Fri, 02 Oct 2026 06:33:33 GMT" across requests. Descriptions are truncated at about 250 characters mid-word. No full text. Categories differ from the index (R-09). Emoji appear in one description (R-10).
- Expected: full text in `content:encoded`, dek as `description`, `lastBuildDate` set to the newest item date, categories from series, no stale caching.
- Fix: rebuild the feed route. Validate with an RSS validator.

**R-23 Social images.**
- Observed: static pages use `/ai4.png`. Essays use S3 images. Project pages use `/ai4.png`.
- Expected: per-page `next/og` images with a branded fallback, served from the site domain.
- Fix: implement `opengraph-image` routes for essays, projects, and series.

**R-24 Sitemap, robots, llms.txt, JSON-LD (could not be verified externally).**
- Verify: fetch `/sitemap.xml`, `/robots.txt`, `/llms.txt`. Inspect the rendered HTML for JSON-LD blocks.
- Expected: sitemap lists only indexable URLs with real `lastModified`. Robots allows all crawlers including AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended). `llms.txt` lists the site summary, key pages, series, and essays with deks. JSON-LD: `Person`, `WebSite`, `BlogPosting`, `BreadcrumbList`, `ProfessionalService`, and project markup. No fake ratings.
- Fix: implement what is missing.

**R-25 Newsletter delivery (could not be verified externally).**
- Verify: submit a test address on staging. Check the confirmation email, the confirm link, and unsubscribe. Check the "Website" field is a hidden honeypot (`aria-hidden`, `tabindex="-1"`, off-screen).
- Expected: double opt-in, token hashes stored, rate limiting, `List-Unsubscribe` headers, no raw emails in logs.
- Fix: build what is missing (table `subscribers`, endpoints for subscribe, confirm, unsubscribe, SES sending, tests).

### Performance

**R-26 Byline avatar.**
- Observed: the byline photo `/sba-photo-2-small.png` requests `w=3840`.
- Expected: render at about 40px with correct `sizes`, `width`, and `height`.
- Fix: update the component. Check every `next/image` for `sizes`.

**R-27 Body images.**
- Observed: images inside essay bodies load directly from `sbaweb-bucket.s3.ap-southeast-2.amazonaws.com` without optimization. Some alt text is weak (for example "Blockchain").
- Expected: images go through `next/image` or a CDN, with explicit dimensions (no layout shift) and descriptive alt text.
- Fix: a markdown image renderer that uses `next/image` or CloudFront URLs. Flag images with missing or weak alt text for the owner.

## 7. Fix order (Phase 3)

1. Group 1: R-01, R-02, R-03, R-04 (build, routing, metadata, cacheability).
2. Group 2: R-05, R-06, R-07, R-09, R-10 (trust and data integrity), plus R-08 and R-11 after owner decisions.
3. Group 3: R-12, R-13, R-14, R-15, R-16, R-17 (reader experience).
4. Group 4: R-22, R-24, R-23 (feed and search).
5. Group 5: R-25 (newsletter) if verification shows gaps.
6. Group 6: R-18, R-19, R-20, R-21 (clients and hiring, with placeholders).
7. Group 7: R-26, R-27 (performance).

After each group: deploy to staging, revalidate all routes, run `verify-live.mjs`, tick `CHECKLIST.md`, and stop for review.

## 8. Owner questions (answer before Phase 3)

- O-1: Is "Opinion" a real series? If not, which series should Physical AI and Evolution belong to?
- O-2: Blockchain 101: publish the parts, relabel as "Planned topics", or trim the list?
- O-3: Which 3 essays are "Start here"?
- O-4: Keep or remove emoji in the Evolution essay body?
- O-5: Confirm "25+ years" and each claim in R-20.
- O-6: Provide the CV PDF, testimonials, case-study metrics, series intros, and the Substack stub text.

## 9. Final report (Phase 4)

Write `docs/final-report.md` with a before and after row per ID: verdict from the reconciliation, what changed, evidence (URL, command, header), and the final status. List anything still open with the reason. Attach the latest `verify-live.mjs` output.
