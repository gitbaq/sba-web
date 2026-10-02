import { web_url } from "@/utils/endpoints/endpoints";

/** Allow major search + AI crawlers; keep private app surfaces closed. */
export function GET() {
  const robotsTxt = `# syedbaqirali.com
# Policy: allow search engines and AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended).
# Owner can tighten this block later if needed.
# Block admin/editor/api surfaces. llms.txt: ${web_url}/llms.txt

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /temp/
Disallow: /editor/

# Explicit allow for key public surfaces
Allow: /writing/
Allow: /work/
Allow: /about/
Allow: /contact/
Allow: /subscribe/
Allow: /privacy/
Allow: /for/
Allow: /feed.xml
Allow: /llms.txt
Allow: /llms-full.txt
Allow: /sitemap

# Google
User-agent: Googlebot
Allow: /

User-agent: Google-Extended
Allow: /

# OpenAI
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

# Anthropic
User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: ClaudeBot
Allow: /

# Perplexity / others
User-agent: PerplexityBot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Bytespider
Disallow: /

Sitemap: ${web_url}/sitemap
`;

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
