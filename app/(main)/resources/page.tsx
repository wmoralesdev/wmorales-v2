import type { Metadata } from "next";
import { MinimalHeader } from "@/components/landing/minimal-header";
import { ResourceLayout } from "@/components/resources/resource-layout";
import { getAllResources, getCategories } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Resources | Walter Morales",
  description:
    "Skills, rules, and tools I use for day-to-day development with Cursor.",
};

export default function ResourcesPage() {
  const resources = getAllResources();
  const categories = getCategories();

  return (
    <div className="space-y-12">
      <MinimalHeader />
      <ResourceLayout resources={resources} categories={categories} />
    </div>
  );
}
