/** Explicit ads.txt for AdSense crawlers (plain text, no HTML CSP baggage). */
const BODY =
  "google.com, pub-3600195581005817, DIRECT, f08c47fec0942fa0\n";

export function GET() {
  return new Response(BODY, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
