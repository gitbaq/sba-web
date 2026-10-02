/**
 * Safe JSON body parsing for fetch responses.
 * Empty / non-JSON bodies (e.g. backend restart) return `fallback` instead of throwing.
 */
export async function readJson<T>(
  res: Response,
  fallback: T
): Promise<T> {
  let text: string;
  try {
    text = await res.text();
  } catch {
    return fallback;
  }
  if (!text || !text.trim()) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

/** Like readJson, but returns null when the body is missing or invalid. */
export async function readJsonOrNull<T>(res: Response): Promise<T | null> {
  return readJson<T | null>(res, null);
}
