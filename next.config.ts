import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["https://popup-post.s3.ap-southeast-1.amazonaws.com"],
    unoptimized: true,
  }
};

export default nextConfig;