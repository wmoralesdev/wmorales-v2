import type { Metadata } from "next";
import { baseMetadata, siteConfig } from "@/lib/metadata";

// Home page uses the default metadata with canonical
export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: siteConfig.url,
  },
};
