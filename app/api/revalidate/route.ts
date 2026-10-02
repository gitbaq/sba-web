import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { ESSAYS_CACHE_TAG } from "@/utils/services/getLatestSubtopics";

/**
 * Bust essay Data Cache after editor save.
 * POST { secret?, paths?: string[] } or GET ?secret=&path=
 * Secret: REVALIDATE_SECRET env (optional in preview if unset).
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    secret?: string;
    paths?: string[];
    tag?: string;
  };
  const secret = body.secret || req.headers.get("x-revalidate-secret") || "";
  const expected = process.env.REVALIDATE_SECRET || "";
  if (expected && secret !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  revalidateTag(body.tag || ESSAYS_CACHE_TAG, "max");
  revalidatePath("/");
  revalidatePath("/writing");
  revalidatePath("/writing/series");
  for (const path of body.paths || []) {
    if (typeof path === "string" && path.startsWith("/")) {
      revalidatePath(path);
    }
  }
  return NextResponse.json({ ok: true, revalidated: true });
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret") || "";
  const expected = process.env.REVALIDATE_SECRET || "";
  if (expected && secret !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const path = req.nextUrl.searchParams.get("path");
  revalidateTag(ESSAYS_CACHE_TAG, "max");
  revalidatePath("/");
  revalidatePath("/writing");
  if (path?.startsWith("/")) revalidatePath(path);
  return NextResponse.json({ ok: true, revalidated: true });
}
