import { FileX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DeckNotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
      <FileX className="mb-6 size-16 text-muted-foreground/50" />
      <h1 className="font-display text-2xl font-semibold text-foreground">
        Deck Not Found
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The presentation you're looking for doesn't exist or couldn't be loaded.
      </p>
      <Button asChild className="mt-6">
        <Link href="/slides">View All Presentations</Link>
      </Button>
    </div>
  );
}
