import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://95.169.204.245/api/v1/:path*/",
      },
    ];
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["95.169.204.245", "albaraka.onlayndokon.uz", "pijamapro.onlayndokon.uz", "texnomart.onlayndokon.uz"],
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
        hostname: "albaraka.onlayndokon.uz",
      },
      {
        protocol: "http",
        hostname: "95.169.204.245",
      },
    ],
  },
};

export default nextConfig;
