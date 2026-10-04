/** Shared admin error helpers so failures are never silently swallowed. */

export function errorMessage(
  err: unknown,
  fallback = "Something went wrong"
): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "string" && err.trim()) return err;
  return fallback;
}

export function fromApiBody(
  body: { message?: string; detail?: string; error?: string; errors?: string[] } | null | undefined,
  fallback: string
): string {
  return (
    body?.errors?.[0] ||
    body?.error ||
    body?.message ||
    body?.detail ||
    fallback
  );
}
