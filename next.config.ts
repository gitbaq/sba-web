import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  crossOrigin: "anonymous",
};

module.exports = {
  images: {
    remotePatterns: [
      new URL("https://sbaweb-bucket.s3.ap-southeast-2.amazonaws.com/**"),
      new URL("https://ai.syedbaqirali.com/**"),
      new URL("https://www.syedbaqirali.com/**"),
    ],
  },
};

export default nextConfig;
