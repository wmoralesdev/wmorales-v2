import { MinimalBlogPreview } from "@/components/landing/minimal-blog-preview";
import { MinimalEventsMarquee } from "@/components/landing/minimal-events-marquee";
import { MinimalExperiences } from "@/components/landing/minimal-experiences";
import { MinimalFooter } from "@/components/landing/minimal-footer";
import { MinimalTech } from "@/components/landing/minimal-tech";
import {
  generatePersonStructuredData,
  generateWebSiteStructuredData,
} from "@/lib/metadata";

export { metadata } from "./metadata";

export default async function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data requires dangerouslySetInnerHTML
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generatePersonStructuredData()),
        }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data requires dangerouslySetInnerHTML
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateWebSiteStructuredData()),
        }}
      />
      <div className="space-y-16">
        <MinimalBlogPreview />
        <MinimalEventsMarquee />
        <MinimalExperiences />
        <MinimalTech />
        <MinimalFooter />
      </div>
    </>
  );
}
