#!/usr/bin/env node
/**
 * Full-site revalidate after deploy.
 * Usage:
 *   REVALIDATE_SECRET=... node scripts/revalidate-all.mjs [base-url]
 */
const BASE = (process.argv[2] || process.env.SITE_URL || "https://www.syedbaqirali.com").replace(
  /\/$/,
  ""
);
const secret = process.env.REVALIDATE_SECRET || "";

async function main() {
  const res = await fetch(`${BASE}/api/revalidate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secret ? { "x-revalidate-secret": secret } : {}),
    },
    body: JSON.stringify({ all: true, secret: secret || undefined }),
  });
  const body = await res.text();
  console.log(res.status, body);
  if (!res.ok) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
