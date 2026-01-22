import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Slides",
  description: "Presentation slides engine",
};

export default function SlidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-dvh bg-background">{children}</div>;
}
