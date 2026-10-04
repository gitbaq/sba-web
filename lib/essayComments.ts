import {
  essay_comments_url,
  essay_comment_submit_url,
} from "@/utils/endpoints/endpoints";
import { readJson } from "@/lib/http";

export type EssayComment = {
  id: number;
  essayId: number;
  authorName: string;
  body: string;
  status?: string;
  createdAt?: string;
};

export async function fetchApprovedComments(
  essayId: number
): Promise<EssayComment[]> {
  try {
    const init: RequestInit =
      typeof window === "undefined"
        ? ({
            next: {
              revalidate: 30,
              tags: [`essay-comments-${essayId}`],
            },
          } as RequestInit)
        : { cache: "no-store" };
    const res = await fetch(essay_comments_url(essayId), init);
    if (!res.ok) return [];
    const data = await readJson<EssayComment[]>(res, []);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function submitEssayComment(
  essayId: number,
  body: string,
  token: string
): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch(essay_comment_submit_url(essayId), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ body }),
    });
    const data = await readJson<{ message?: string; status?: string }>(res, {});
    if (!res.ok) {
      return {
        ok: false,
        message: data.message || "Could not post comment. Try again.",
      };
    }
    return {
      ok: true,
      message:
        data.message || "Thanks. Your comment is awaiting moderation.",
    };
  } catch {
    return { ok: false, message: "Could not post comment. Try again." };
  }
}
