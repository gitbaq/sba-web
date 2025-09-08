import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  crossOrigin: "anonymous",
  outputFileTracingRoot:
    "/Users/syedbaqirali/src/_prod_projects/sbaweb/sbaweb_frontend",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sbaweb-bucket.s3.ap-southeast-2.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
