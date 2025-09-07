import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better CloudFlare compatibility
  experimental: {
    // Enable experimental features
  },

  // Optimize for static generation
  output: 'export',

  // Disable server-side features for static generation
  trailingSlash: true,

  // Configure images for static export
  images: {
    unoptimized: true,
  },

  // Environment variables
  env: {
    // You can add environment variables here if needed
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
