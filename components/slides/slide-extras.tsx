"use client";

import { BookOpen, ExternalLink, Info } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Slide } from "@/lib/slides/schema";

interface SlideExtrasProps {
  slide: Slide;
  variant: "sidebar" | "floating";
}

function ExtrasContent({ slide }: { slide: Slide }) {
  const hasFootnotes = slide.footnotes && slide.footnotes.length > 0;
  const hasResources = slide.resources && slide.resources.length > 0;

  if (!hasFootnotes && !hasResources) return null;

  return (
    <div className="space-y-4">
      {hasFootnotes && (
        <section className="space-y-2">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <BookOpen className="size-3" />
            Notes
          </h3>
          <ul className="space-y-2">
            {slide.footnotes?.map((note, i) => (
              <li
                key={`fn-${i}-${note.slice(0, 20)}`}
                className="flex gap-2 text-sm text-foreground/80"
              >
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-[10px] font-semibold text-accent">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{note}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasResources && (
        <section className="space-y-2">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <ExternalLink className="size-3" />
            Resources
          </h3>
          <ul className="space-y-1.5">
            {slide.resources?.map((resource) => (
              <li key={resource.url}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-1.5 text-sm text-accent hover:underline"
                >
                  <ExternalLink className="mt-0.5 size-3 shrink-0 opacity-60 group-hover:opacity-100" />
                  <span>{resource.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export function SlideExtras({ slide, variant }: SlideExtrasProps) {
  const [open, setOpen] = useState(false);

  const hasExtras =
    (slide.footnotes && slide.footnotes.length > 0) ||
    (slide.resources && slide.resources.length > 0);

  if (!hasExtras) return null;

  if (variant === "sidebar") {
    return (
      <div className="rounded-xl border border-border/60 bg-background/80 p-4 backdrop-blur-sm">
        <ExtrasContent slide={slide} />
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="size-10 rounded-full shadow-md"
          aria-label="Open notes and resources"
        >
          <Info className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-base">
            Notes &amp; Resources
          </DialogTitle>
        </DialogHeader>
        <ExtrasContent slide={slide} />
      </DialogContent>
    </Dialog>
  );
}
