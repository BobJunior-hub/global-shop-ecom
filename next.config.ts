import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://kidsworld.onlayndokon.uz/api/v1/:path*",
      },
    ];
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["kidsworld.onlayndokon.uz"],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "brendfeys.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "kidsworld.onlayndokon.uz",
      },
    ],
  },
};

export default nextConfig;
