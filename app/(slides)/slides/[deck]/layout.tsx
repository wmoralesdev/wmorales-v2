import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DeckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background">
      <header className="fixed inset-x-0 top-0 z-40 flex h-12 items-center border-b border-border bg-background px-4">
        <Link
          href="/slides"
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          All Decks
        </Link>
      </header>
      <div className="pt-12">{children}</div>
    </div>
  );
}
