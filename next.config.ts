import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:path*",
          has: [
            {
              type: "host",
              value: "(?<brokerId>.*)\\.loanoptionscalculator\\.com",
            },
          ],
          destination: "/:brokerId/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
