import { setRequestLocale } from "next-intl/server";
import { CursorPageContent } from "@/components/cursor/cursor-page-content";

export { metadata } from "./metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CursorPage({ params }: Props) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return <CursorPageContent />;
}
