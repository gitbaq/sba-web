import type { NextConfig } from "next";
import { LEGACY_ARTICLE_PATHS } from "./lib/articles";
import { LEGACY_SERIES_REDIRECTS } from "./lib/legacySeries";

const nextConfig: NextConfig = {
  output: "standalone",
  crossOrigin: "anonymous",
  experimental: {
    // TypeScript 7 has no JS compiler API yet - use local `tsc` CLI (TS7 via @typescript/native).
    useTypeScriptCli: true,
  },
  async redirects() {
    return [
      {
        source: "/learning",
        destination: "/writing",
        permanent: true,
      },
      {
        source: "/learning/:id",
        destination: "/writing/:id",
        permanent: true,
      },
      {
        source: "/for/clients",
        destination: "/work-with-me",
        permanent: true,
      },
      {
        source: "/for/hiring",
        destination: "/about#hiring",
        permanent: true,
      },
      {
        source: "/for/readers",
        destination: "/writing",
        permanent: true,
      },
      ...LEGACY_ARTICLE_PATHS.map(({ source, slug }) => ({
        source,
        destination: `/writing/${slug}`,
        permanent: true,
      })),
      ...LEGACY_SERIES_REDIRECTS.map(({ source, destination }) => ({
        source,
        destination,
        permanent: true,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // AdSense also loads SODAR (adtrafficquality.google) for traffic quality checks.
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.googlesyndication.com https://*.googleadservices.com https://www.googletagservices.com https://*.adtrafficquality.google https://challenges.cloudflare.com https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://*.googlesyndication.com https://*.googleadservices.com https://*.doubleclick.net https://*.adtrafficquality.google https://api.syedbaqirali.com https://challenges.cloudflare.com https://vitals.vercel-insights.com",
              "frame-src https://challenges.cloudflare.com https://calendly.com https://*.doubleclick.net https://*.googlesyndication.com https://*.googleadservices.com https://*.adtrafficquality.google https://www.google.com https://googleads.g.doubleclick.net",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sbaweb-bucket.s3.ap-southeast-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "substack-post-media.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ai.syedbaqirali.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.syedbaqirali.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.codingburo.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
