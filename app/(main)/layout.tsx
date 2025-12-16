export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-24 wm-reveal">
      {children}
    </div>
  );
}
