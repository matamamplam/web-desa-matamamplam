import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'data.bmkg.go.id',
      },
    ],
  },
  // Optimize build performance for Vercel
  // Limit concurrency to prevent DB connection timeout during build
  experimental: {
    // Disable worker threads to reduce concurrent DB connections during build
    workerThreads: false,
    // Limit CPU usage to prevent connection pool exhaustion
    cpus: 1,
  },
  // Add output configuration for better Vercel deployment
  output: 'standalone',
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
