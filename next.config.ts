import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const MAX_QUALITY = 100;
const MIN_QUALITY = 75;

const nextConfig: NextConfig = {
  images: {
    qualities: [MAX_QUALITY, MIN_QUALITY],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.keystatic.app",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "qikotilzxqgnbjpgmgbj.supabase.co",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
