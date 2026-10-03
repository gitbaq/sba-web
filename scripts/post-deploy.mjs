#!/usr/bin/env node
/**
 * Post-deploy checklist (P8-04):
 * 1) revalidate all
 * 2) verify-live (HTML + discovery + redirects)
 * 3) optional Lighthouse if installed
 *
 * Usage:
 *   REVALIDATE_SECRET=... node scripts/post-deploy.mjs
 *   node scripts/post-deploy.mjs https://www.syedbaqirali.com
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const base = (process.argv[2] || "https://www.syedbaqirali.com").replace(/\/$/, "");

function run(cmd, args, opts = {}) {
  console.log(`\n> ${cmd} ${args.join(" ")}`);
  const res = spawnSync(cmd, args, {
    cwd: path.join(root, ".."),
    stdio: "inherit",
    env: process.env,
    ...opts,
  });
  if (res.status !== 0) {
    process.exit(res.status || 1);
  }
}

if (process.env.REVALIDATE_SECRET) {
  run("node", ["scripts/revalidate-all.mjs", base]);
} else {
  console.log("Skip revalidate: REVALIDATE_SECRET not set");
}

run("node", ["scripts/verify-live.mjs", base]);

const lh = spawnSync("npx", ["--yes", "lighthouse", "--version"], {
  encoding: "utf8",
});
if (lh.status === 0) {
  console.log("\nLighthouse targets (manual gate): LCP < 2.5s, CLS < 0.1, INP < 200ms, score >= 90");
  run("npx", [
    "--yes",
    "lighthouse",
    `${base}/`,
    "--only-categories=performance,accessibility",
    "--chrome-flags=--headless=new",
    "--quiet",
    "--output=json",
    "--output-path=./lighthouse-home.json",
  ]);
} else {
  console.log("\nSkip Lighthouse: not available via npx in this environment");
}

console.log("\npost-deploy: done");
