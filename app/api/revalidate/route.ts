import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { ESSAYS_CACHE_TAG } from "@/utils/services/getLatestSubtopics";

/** Data-cache tags used across public fetch helpers. */
export const CACHE_TAGS = [
  ESSAYS_CACHE_TAG,
  "work-projects",
  "about-config",
  "home-config",
] as const;

/** Core public paths to bust on a full revalidate (deploy or publish). */
export const CORE_PATHS = [
  "/",
  "/writing",
  "/writing/series",
  "/work",
  "/about",
  "/contact",
  "/subscribe",
  "/privacy",
  "/work-with-me",
  "/about",
  "/feed.xml",
  "/sitemap",
  "/sitemap.xml",
  "/robots.txt",
  "/llms.txt",
  "/llms-full.txt",
] as const;

function authorize(secret: string): boolean {
  const expected = process.env.REVALIDATE_SECRET || "";
  if (!expected) return true;
  return secret === expected;
}

function bustAll(extraPaths: string[] = []) {
  for (const tag of CACHE_TAGS) {
    revalidateTag(tag, "max");
  }
  const paths = new Set<string>([...CORE_PATHS, ...extraPaths]);
  for (const path of paths) {
    if (path.startsWith("/")) revalidatePath(path);
  }
}

/**
 * Bust Next.js Data Cache + path cache after publish or deploy.
 * POST { secret?, tag?, paths?, all?: boolean }
 * GET ?secret=&path=&all=1
 * Header: x-revalidate-secret
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    secret?: string;
    paths?: string[];
    tag?: string;
    all?: boolean;
  };
  const secret = body.secret || req.headers.get("x-revalidate-secret") || "";
  if (!authorize(secret)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const extra = (body.paths || []).filter(
    (p): p is string => typeof p === "string" && p.startsWith("/")
  );

  if (body.all) {
    bustAll(extra);
    return NextResponse.json({
      ok: true,
      revalidated: true,
      scope: "all",
      tags: CACHE_TAGS,
      paths: [...CORE_PATHS, ...extra],
    });
  }

  revalidateTag(body.tag || ESSAYS_CACHE_TAG, "max");
  revalidatePath("/");
  revalidatePath("/writing");
  revalidatePath("/writing/series");
  for (const path of extra) {
    revalidatePath(path);
  }
  return NextResponse.json({
    ok: true,
    revalidated: true,
    tag: body.tag || ESSAYS_CACHE_TAG,
    paths: ["/", "/writing", "/writing/series", ...extra],
  });
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret") || "";
  if (!authorize(secret)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const path = req.nextUrl.searchParams.get("path");
  const all = req.nextUrl.searchParams.get("all") === "1";
  const extra = path?.startsWith("/") ? [path] : [];

  if (all) {
    bustAll(extra);
    return NextResponse.json({ ok: true, revalidated: true, scope: "all" });
  }

  revalidateTag(ESSAYS_CACHE_TAG, "max");
  revalidatePath("/");
  revalidatePath("/writing");
  for (const p of extra) revalidatePath(p);
  return NextResponse.json({ ok: true, revalidated: true });
}
