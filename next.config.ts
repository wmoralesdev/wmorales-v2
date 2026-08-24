import path from "node:path";
import withStylexTurbopack from "@stylexswc/nextjs-plugin/turbopack";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const MAX_QUALITY = 100;
const MIN_QUALITY = 75;

const nextConfig: NextConfig = {
  experimental: {
    // Enable filesystem caching to reduce compile times and resource usage across dev restarts
    turbopackFileSystemCacheForDev: true,
    viewTransition: true,
  },
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
  outputFileTracingIncludes: {
    "/blog": ["./content/**/*"],
    "/blog/*": ["./content/**/*"],
    "/sitemap.xml": ["./content/**/*"],
    "/slides": ["./content/slides/**/*"],
    "/slides/*": ["./content/slides/**/*"],
  },
};

const stylexOptions = {
  rsOptions: {
    dev: process.env.NODE_ENV !== "production",
    aliases: {
      "@/*": [path.join(process.cwd(), "*")],
    },
    unstable_moduleResolution: {
      type: "commonJS" as const,
    },
  },
};

export default withStylexTurbopack(stylexOptions)(withNextIntl(nextConfig));
