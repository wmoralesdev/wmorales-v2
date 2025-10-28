import type { Metadata } from "next";
import { createMetadata, pageMetadata, siteConfig } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: pageMetadata.showcase.title,
  description: pageMetadata.showcase.description,
  keywords: pageMetadata.showcase.keywords,
  openGraph: {
    title: `${pageMetadata.showcase.title} | ${siteConfig.name}`,
    description: pageMetadata.showcase.description,
    url: `${siteConfig.url}/showcase`,
    images: [
      {
        url: "/og-showcase.png", // Consider creating a specific OG image
        width: 1200,
        height: 630,
        alt: "Project Showcase - Walter Morales Portfolio",
      },
    ],
  },
  twitter: {
    title: `${pageMetadata.showcase.title} | ${siteConfig.name}`,
    description: pageMetadata.showcase.description,
    images: ["/og-showcase.png"],
  },
  alternates: {
    canonical: `${siteConfig.url}/showcase`,
  },
});
