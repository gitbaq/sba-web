import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { CACHE_TAGS, CORE_PATHS } from "@/lib/revalidateShared";

/**
 * Admin-session revalidate. Uses the server REVALIDATE_SECRET so browser
 * clients do not need it (public /api/revalidate requires the secret).
 */
function isAdminSession(req: NextRequest): boolean {
  const token = req.cookies.get("token")?.value;
  const username = req.cookies.get("username")?.value?.toLowerCase();
  const email = req.cookies.get("email")?.value?.toLowerCase();
  if (!token) return false;
  if (username === "admin") return true;
  const allowed = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return Boolean(email && allowed.includes(email));
}

export async function POST(req: NextRequest) {
  if (!isAdminSession(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    paths?: string[];
    tag?: string;
    all?: boolean;
  };

  const extra = (body.paths || []).filter(
    (p): p is string => typeof p === "string" && p.startsWith("/")
  );

  if (body.all) {
    for (const tag of CACHE_TAGS) {
      revalidateTag(tag, "max");
    }
    for (const path of new Set([...CORE_PATHS, ...extra])) {
      revalidatePath(path);
    }
    return NextResponse.json({ ok: true, revalidated: true, scope: "all" });
  }

  if (body.tag) {
    revalidateTag(body.tag, "max");
  }
  for (const path of extra.length ? extra : ["/", "/about"]) {
    revalidatePath(path);
  }

  return NextResponse.json({
    ok: true,
    revalidated: true,
    tag: body.tag || null,
    paths: extra,
  });
}
