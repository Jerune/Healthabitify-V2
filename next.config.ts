import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/v2",
        destination: "https://api.ouraring.com/v2",
      },
      {
        source: "/v2/:path*",
        destination: "https://api.ouraring.com/v2/:path*",
      },
      // Fitbit API – proxy everything under /1 to api.fitbit.com/1
      {
        source: "/1/:path*",
        destination: "https://api.fitbit.com/1/:path*",
      },
    ];
  },
};

export default nextConfig;
