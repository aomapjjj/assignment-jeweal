import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "isanook",
      },
      {
        protocol: "https",
        hostname: "mpics.mgronline",
      },
      {
        protocol: "https",
        hostname: "thunder.in.th",
      },
    ],
  },
};

export default nextConfig;