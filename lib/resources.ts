import resourcesData from "@/content/resources.json";

export type ResourceCategory = "skills" | "commands" | "rules" | "tools";

export type Resource = {
  slug: string;
  name: string;
  category: ResourceCategory;
  description: string;
  installPath?: string;
  body: string;
  examples?: string[];
  tags?: string[];
};

const resources: Resource[] = resourcesData as Resource[];

export function getAllResources(): Resource[] {
  return resources;
}

export function getResourceBySlug(slug: string): Resource | undefined {
  return resources.find((r) => r.slug === slug);
}

export function getResourcesByCategory(category: ResourceCategory): Resource[] {
  return resources.filter((r) => r.category === category);
}

export function getCategories(): ResourceCategory[] {
  const cats = new Set(resources.map((r) => r.category));
  // Fixed order
  const order: ResourceCategory[] = ["skills", "commands", "rules", "tools"];
  return order.filter((c) => cats.has(c));
}
