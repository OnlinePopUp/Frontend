/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ["popup-post.s3.ap-southeast-1.amazonaws.com"], // ✅ 허용할 이미지 도메인 추가
    },
  };
  
  module.exports = nextConfig;
  