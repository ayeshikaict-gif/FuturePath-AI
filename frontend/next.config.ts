import type { NextConfig } from "next";

const backendUrl =
  process.env.BACKEND_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://future-path-ai-mfso.vercel.app"
    : "http://127.0.0.1:8000");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Proxy all /api/v1 requests seamlessly to the FastAPI backend
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
