import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Seamlessly proxy to external backend if BACKEND_URL is set, or local development server
  async rewrites() {
    if (process.env.BACKEND_URL) {
      return [
        {
          source: "/api/v1/:path*",
          destination: `${process.env.BACKEND_URL}/api/v1/:path*`,
        },
      ];
    }
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/v1/:path*",
          destination: "http://127.0.0.1:8000/api/v1/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
