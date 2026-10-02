import type { NextConfig } from "next";
import { LEGACY_ARTICLE_PATHS } from "./lib/articles";

const nextConfig: NextConfig = {
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
      ...LEGACY_ARTICLE_PATHS.map(({ source, slug }) => ({
        source,
        destination: `/writing/${slug}`,
        permanent: true,
      })),
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
