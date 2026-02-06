import { MinimalHeader } from "@/components/landing/minimal-header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <div className="space-y-12">
        <MinimalHeader />
        {children}
      </div>
    </div>
  );
}
