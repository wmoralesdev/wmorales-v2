import type { Metadata } from "next";
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

  return <ResourceLayout resources={resources} categories={categories} />;
}
