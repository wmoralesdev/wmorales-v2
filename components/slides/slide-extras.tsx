"use client";

import * as stylex from "@stylexjs/stylex";
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
import { icon } from "@/lib/stylex/icons";
import { colors, fonts, radii } from "@/lib/stylex/tokens.stylex";

interface SlideExtrasProps {
  slide: Slide;
  variant: "sidebar" | "floating";
}

const styles = stylex.create({
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  heading: {
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: colors.mutedForeground,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  resourceList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },
  note: {
    display: "flex",
    gap: "0.5rem",
    fontSize: "0.875rem",
    color: `color-mix(in oklch, ${colors.foreground}, transparent 20%)`,
  },
  noteIndex: {
    marginTop: "0.125rem",
    display: "flex",
    width: "1rem",
    height: "1rem",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.full,
    backgroundColor: `color-mix(in oklch, ${colors.accent}, transparent 90%)`,
    fontFamily: fonts.mono,
    fontSize: "0.625rem",
    fontWeight: 600,
    color: colors.accent,
  },
  noteText: {
    lineHeight: 1.625,
  },
  resource: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.375rem",
    fontSize: "0.875rem",
    color: colors.accent,
    ":hover": {
      textDecoration: "underline",
    },
  },
  resourceIcon: {
    marginTop: "0.125rem",
    width: "0.75rem",
    height: "0.75rem",
    flexShrink: 0,
    opacity: 0.6,
  },
  sidebar: {
    borderRadius: radii.xl,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: `color-mix(in oklch, ${colors.border}, transparent 40%)`,
    backgroundColor: `color-mix(in oklch, ${colors.background}, transparent 20%)`,
    padding: "1rem",
    backdropFilter: "blur(4px)",
  },
  trigger: {
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: radii.full,
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  },
  dialog: {
    maxWidth: "24rem",
  },
  dialogTitle: {
    fontFamily: fonts.display,
    fontSize: "1rem",
  },
});

function ExtrasContent({ slide }: { slide: Slide }) {
  const hasFootnotes = slide.footnotes && slide.footnotes.length > 0;
  const hasResources = slide.resources && slide.resources.length > 0;

  if (!hasFootnotes && !hasResources) return null;

  return (
    <div {...stylex.props(styles.content)}>
      {hasFootnotes && (
        <section {...stylex.props(styles.section)}>
          <h3 {...stylex.props(styles.heading)}>
            <BookOpen {...stylex.props(icon.sm)} />
            Notes
          </h3>
          <ul {...stylex.props(styles.list)}>
            {slide.footnotes?.map((note, i) => (
              <li
                key={`fn-${i}-${note.slice(0, 20)}`}
                {...stylex.props(styles.note)}
              >
                <span {...stylex.props(styles.noteIndex)}>{i + 1}</span>
                <span {...stylex.props(styles.noteText)}>{note}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasResources && (
        <section {...stylex.props(styles.section)}>
          <h3 {...stylex.props(styles.heading)}>
            <ExternalLink {...stylex.props(icon.sm)} />
            Resources
          </h3>
          <ul {...stylex.props(styles.resourceList)}>
            {slide.resources?.map((resource) => (
              <li key={resource.url}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...stylex.props(styles.resource)}
                >
                  <ExternalLink {...stylex.props(styles.resourceIcon)} />
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
      <div {...stylex.props(styles.sidebar)}>
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
          className={stylex.props(styles.trigger).className}
          aria-label="Open notes and resources"
        >
          <Info {...stylex.props(icon.md)} />
        </Button>
      </DialogTrigger>
      <DialogContent className={stylex.props(styles.dialog).className}>
        <DialogHeader>
          <DialogTitle className={stylex.props(styles.dialogTitle).className}>
            Notes &amp; Resources
          </DialogTitle>
        </DialogHeader>
        <ExtrasContent slide={slide} />
      </DialogContent>
    </Dialog>
  );
}
