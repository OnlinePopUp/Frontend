/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "popup-post.s3.ap-southeast-1.amazonaws.com", // 기존 도메인
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "popppl-item-images.s3.ap-northeast-2.amazonaws.com", // 추가 도메인
      },
    ],
  },
};

module.exports = nextConfig;