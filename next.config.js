const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [], // 添加你的图片域名
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = withPWA(nextConfig);