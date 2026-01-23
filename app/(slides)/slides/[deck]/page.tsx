import { redirect } from "next/navigation";
import { listDeckSlugs } from "@/lib/slides";

export const dynamicParams = false;

interface PageProps {
  params: Promise<{ deck: string }>;
}

export async function generateStaticParams() {
  const slugs = listDeckSlugs();
  return slugs.map((deck) => ({ deck }));
}

export default async function DeckIndexPage({ params }: PageProps) {
  const { deck } = await params;
  redirect(`/slides/${deck}/0`);
}
