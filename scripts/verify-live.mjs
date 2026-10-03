#!/usr/bin/env node
/**
 * Live site checks (CURSOR_PROMPT §5).
 * Usage:
 *   node scripts/verify-live.mjs [base-url]
 *   node scripts/verify-live.mjs [base-url] --full   # include P2 copy lint
 * Exit 0 when all checks pass; non-zero otherwise.
 */

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
/** --full keeps legacy alias; copy lint (banned + dashes) is always on from P2. */
const BASE = (args[0] || "https://www.syedbaqirali.com").replace(/\/$/, "");

const BANNED = [
  "about one piece a week",
  "get weekly insights",
  "wrong path",
  "updated from admin when needed",
  "choose how to browse",
  "still maturing toward full capability",
];

const SAMPLE_PATHS = [
  "/",
  "/writing",
  "/work",
  "/work/blox",
  "/about",
  "/contact",
  "/subscribe",
  "/for/clients",
  "/privacy",
];

const SKIP_PREFIXES = ["/feed.xml", "/llms.txt", "/llms-full.txt", "/sitemap", "/robots.txt"];

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function meta(html, attr, name) {
  const re = new RegExp(
    `<meta[^>]+${attr}=["']${name}["'][^>]+content=["']([^"']*)["']`,
    "i"
  );
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${name}["']`,
    "i"
  );
  return (html.match(re) || html.match(re2) || [])[1] || "";
}

function tagContent(html, tag) {
  const m = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? m[1].replace(/<[^>]+>/g, "").trim() : "";
}

function canonical(html) {
  const m = html.match(
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i
  );
  const m2 = html.match(
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i
  );
  return (m || m2 || [])[1] || "";
}

function countH1(html) {
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] || html;
  const cleaned = main
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");
  return (cleaned.match(/<h1\b/gi) || []).length;
}

function isHtmlPath(path) {
  return !SKIP_PREFIXES.some((p) => path === p || path.startsWith(p + "?"));
}

async function fetchText(url) {
  const res = await fetch(url, {
    redirect: "manual",
    headers: { "user-agent": "sba-verify-live/1.0" },
  });
  const location = res.headers.get("location") || "";
  const type = res.headers.get("content-type") || "";
  const text = res.status >= 200 && res.status < 400 ? await res.text() : "";
  return { status: res.status, location, text, type };
}

async function loadRouteList() {
  const sitemapUrl = `${BASE}/sitemap`;
  try {
    const { status, text } = await fetchText(sitemapUrl);
    if (status === 200 && text.includes("<url>")) {
      const locs = [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
      const paths = locs
        .map((u) => {
          try {
            const url = new URL(u);
            return url.origin === new URL(BASE).origin ? url.pathname : null;
          } catch {
            return null;
          }
        })
        .filter(Boolean)
        .filter(isHtmlPath);
      if (paths.length) return [...new Set(["/", ...paths])];
    }
  } catch {
    /* fall through */
  }
  return SAMPLE_PATHS;
}

async function checkUrl(path) {
  const url = `${BASE}${path}`;
  const errors = [];
  const { status, location, text, type } = await fetchText(url);

  if (status >= 300 && status < 400) {
    errors.push(`redirect ${status} -> ${location}`);
    return { path, errors, title: "", ogTitle: "", ogUrl: "" };
  }
  if (status !== 200) {
    errors.push(`status ${status}`);
    return { path, errors, title: "", ogTitle: "", ogUrl: "" };
  }

  if (!type.includes("text/html") || !isHtmlPath(path)) {
    return { path, errors, title: "", ogTitle: "", ogUrl: "", skipped: true };
  }

  const title = tagContent(text, "title");
  const description = meta(text, "name", "description");
  const ogTitle = meta(text, "property", "og:title");
  const ogUrl = meta(text, "property", "og:url");
  const ogDesc = meta(text, "property", "og:description");
  const canon = canonical(text);
  const visible = stripTags(text);
  const h1 = countH1(text);

  if (!title) errors.push("missing title");
  if (!description) errors.push("missing description");
  if (!ogTitle) errors.push("missing og:title");
  if (!ogUrl) errors.push("missing og:url");
  if (!ogDesc) errors.push("missing og:description");
  if (canon && ogUrl && canon.replace(/\/$/, "") !== ogUrl.replace(/\/$/, "")) {
    errors.push(`canonical (${canon}) != og:url (${ogUrl})`);
  }
  if (h1 !== 1) errors.push(`expected 1 H1 in main, found ${h1}`);
  if (/\bLoading[….]?\b/i.test(visible)) {
    errors.push('visible HTML contains "Loading"');
  }
  if (/name=["']keywords["']/i.test(text)) {
    errors.push("meta keywords present");
  }

  // Login link in SSR markup (outside scripts) must stay static for cacheability.
  const markup = text
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");
  const loginHrefs = [...markup.matchAll(/href="(\/login[^"]*)"/g)].map((m) => m[1]);
  for (const href of loginHrefs) {
    if (href.includes("callbackUrl")) {
      errors.push("SSR Login link includes callbackUrl (breaks static cache)");
    }
  }

  for (const phrase of BANNED) {
    if (visible.toLowerCase().includes(phrase)) {
      errors.push(`banned phrase: ${phrase}`);
    }
  }
  if (/[\u2013\u2014]/.test(visible)) {
    errors.push("em-dash or en-dash in visible text");
  }

  return { path, errors, title, ogTitle, ogUrl, description };
}

async function main() {
  console.log(`verify-live: ${BASE}`);
  const routes = await loadRouteList();
  const prioritized = [
    ...SAMPLE_PATHS,
    ...routes.filter((p) => !SAMPLE_PATHS.includes(p)),
  ].slice(0, 40);

  const results = [];
  for (const path of prioritized) {
    results.push(await checkUrl(path));
  }

  const htmlResults = results.filter((r) => !r.skipped);
  const titles = htmlResults.filter((r) => r.title).map((r) => r.title);
  const titleCounts = titles.reduce((acc, t) => {
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  for (const r of htmlResults) {
    if (r.title && titleCounts[r.title] > 1) {
      const others = htmlResults.filter(
        (x) => x.title === r.title && x.path !== r.path
      );
      if (others.length) {
        r.errors.push(
          `duplicate title shared with ${others.map((o) => o.path).join(", ")}`
        );
      }
    }
  }

  const blox = htmlResults.find((r) => r.path === "/work/blox");
  const home = htmlResults.find((r) => r.path === "/");
  if (blox && home && blox.ogUrl && home.ogUrl && blox.ogUrl === home.ogUrl) {
    blox.errors.push("og:url matches homepage (inheritance bug)");
  }
  if (
    blox &&
    home &&
    blox.ogTitle &&
    home.ogTitle &&
    blox.ogTitle === home.ogTitle
  ) {
    blox.errors.push("og:title matches homepage (inheritance bug)");
  }

  let failed = 0;
  for (const r of results) {
    if (r.skipped) {
      console.log(`SKIP ${r.path}`);
      continue;
    }
    if (r.errors.length) {
      failed += 1;
      console.log(`FAIL ${r.path}`);
      for (const e of r.errors) console.log(`  - ${e}`);
    } else {
      console.log(`OK   ${r.path}`);
    }
  }

  console.log(`\nChecked ${htmlResults.length} HTML URLs; ${failed} failed.`);
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
