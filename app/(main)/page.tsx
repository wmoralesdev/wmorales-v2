import { MinimalBlogPreview } from "@/components/landing/minimal-blog-preview";
import { MinimalExperiences } from "@/components/landing/minimal-experiences";
import { MinimalFooter } from "@/components/landing/minimal-footer";
import { MinimalHeader } from "@/components/landing/minimal-header";
import { MinimalTech } from "@/components/landing/minimal-tech";

export { metadata } from "./metadata";

export default async function Home() {
  return (
    <div className="space-y-16">
      <MinimalHeader />
      <MinimalBlogPreview />
      <MinimalExperiences />
      <MinimalTech />
      <MinimalFooter />
    </div>
  );
}
