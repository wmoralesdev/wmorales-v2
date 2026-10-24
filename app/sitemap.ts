import type { MetadataRoute } from "next";
import { CONSULTANT_PATH } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      images: [`${SITE_URL}/photos/walter-morales.jpg`],
    },
    {
      url: `${SITE_URL}/book`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Not linked from the site's navigation: the sitemap is how crawlers find it.
    {
      url: `${SITE_URL}${CONSULTANT_PATH}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      images: [`${SITE_URL}/photos/walter-morales.jpg`],
    },
  ];
}
