import type { NextConfig } from "next";

const gone = [
  "/blog",
  "/blog/:path*",
  "/activities",
  "/resources",
  "/design-system",
  "/slides",
  "/slides/:path*",
];

// Short links printed on QR codes (tent cards, flyers). Temporary so targets can change.
const shortLinks: Record<string, string> = {
  "tent-card-front-01": "https://cursorelsalvador.com/cafe-cursor-jet#menu",
};

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // The previous site's sections no longer exist; keep their link equity on the home page.
  async redirects() {
    return [
      // intro.wmorales.dev is the address Walter says out loud: every path on it
      // lands on the intro card. The subdomain must also be added to the Vercel
      // project (Settings → Domains) for requests to reach this app at all.
      // Temporary, so the target can change without browsers caching the old one.
      {
        source: "/:path*",
        has: [{ type: "host", value: "intro.wmorales.dev" }],
        destination: "https://wmorales.dev/intro",
        permanent: false,
      },
      ...Object.entries(shortLinks).map(([code, destination]) => ({
        source: `/r/${code}`,
        destination,
        permanent: false,
      })),
      ...gone.map((source) => ({
        source,
        destination: "/",
        permanent: true,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/halftone/:file*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
