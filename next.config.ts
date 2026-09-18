import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/quote",
        destination: "/get-free-quote",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
