import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000", // 👈 importante incluir a porta
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
