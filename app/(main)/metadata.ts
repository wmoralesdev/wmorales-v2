import type { Metadata } from "next";
import { createMetadata, siteConfig } from "@/lib/metadata";

// Home page uses the default metadata with canonical
export const metadata: Metadata = createMetadata({
  alternates: {
    canonical: siteConfig.url,
  },
});
