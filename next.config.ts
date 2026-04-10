import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wowfy.in",
        port: "",
        pathname: "/wowfy_app_codebase/**",
      },
    ],
  },
};

export default nextConfig;
