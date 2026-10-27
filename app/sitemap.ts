import type { MetadataRoute } from "next";
import { languages, path, type RouteKey } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/site";

// /intro is noindex, so it stays out. The consultant landing isn't linked from the
// site's navigation: the sitemap is how crawlers find it.
const pages: {
  key: RouteKey;
  priority: number;
  image?: boolean;
}[] = [
  { key: "home", priority: 1, image: true },
  { key: "consultant", priority: 0.9, image: true },
  { key: "book", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return pages.flatMap(({ key, priority, image }) => {
    const alternates = {
      languages: Object.fromEntries(
        Object.entries(languages(key)).map(([l, p]) => [l, `${SITE_URL}${p}`]),
      ),
    };
    return (["es", "en"] as const).map((lang) => ({
      url: `${SITE_URL}${path(lang, key)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
      alternates,
      ...(image && { images: [`${SITE_URL}/photos/walter-morales.jpg`] }),
    }));
  });
}
