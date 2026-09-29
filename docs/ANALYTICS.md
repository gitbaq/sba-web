# Analytics measurement plan (Phase 5)

**Property:** GA4 `G-8EVK1ZF0L8` via `@next/third-parties/google`  
**Also:** Vercel Analytics + Speed Insights (layout)

## Events

| Event | When | Params |
| --- | --- | --- |
| `subscribe_submit` | Subscribe form success/error | `status` |
| `audience_select` | Home path picker choice | `audience_id`, `audience_href` |
| `cta_click` | Key CTAs (home hero) | `cta_label`, `cta_href`, `cta_location` |
| `article_read_depth` | Scroll milestones on articles | `percent` (25/50/75/100), `article_slug`, `article_title` |
| `contact_submit` | Contact form success/error | `status` |

Helpers live in `lib/analytics.ts` (`trackEvent`, `trackCta`).

## Search Console

Set `NEXT_PUBLIC_GSC_VERIFICATION` to the Google HTML-tag verification token to inject `metadata.verification.google`.

## Consent

No CMP yet — personal site, GA loads with the page. Add region-aware consent if EU traffic requires it.

## LLM surfaces

- `/llms.txt` — short brand + IA index
- `/llms-full.txt` — series, work, recent abstracts
- `/robots.txt` — allows GPTBot, ClaudeBot, Google-Extended, PerplexityBot; blocks Bytespider
