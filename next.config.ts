import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
  },
  // Optional: force static generation fallback to avoid mismatch
  output: "standalone",
};

export default nextConfig;
