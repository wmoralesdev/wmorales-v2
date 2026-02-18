import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Slides",
  description: "Presentation slides",
};

export default function SlidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
