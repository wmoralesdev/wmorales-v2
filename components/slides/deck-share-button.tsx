"use client";

import * as stylex from "@stylexjs/stylex";
import { Check, Copy, Share2 } from "lucide-react";
import { useCallback, useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { icon } from "@/lib/stylex/icons";
import { colors, fonts, radii } from "@/lib/stylex/tokens.stylex";

interface DeckShareButtonProps {
  slug: string;
  title: string;
}

const styles = stylex.create({
  trigger: {
    width: "2rem",
    height: "2rem",
  },
  dialog: {
    display: "flex",
    maxHeight: "90dvh",
    width: "92vw",
    maxWidth: "56rem",
    flexDirection: "column",
    gap: "1.5rem",
    overflow: "auto",
    "@media (min-width: 640px)": {
      width: "88vw",
    },
    "@media (min-width: 768px)": {
      width: "85vw",
    },
  },
  title: {
    fontFamily: fonts.display,
    fontSize: "1.25rem",
    "@media (min-width: 640px)": {
      fontSize: "1.5rem",
    },
  },
  body: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "2rem",
    paddingBlock: "1rem",
  },
  qrWrap: {
    borderRadius: "1rem",
    backgroundColor: "white",
    padding: "1.5rem",
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  },
  urlRow: {
    display: "flex",
    width: "100%",
    minWidth: 0,
    alignItems: "center",
    gap: "0.75rem",
  },
  url: {
    minWidth: 0,
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    borderRadius: radii.lg,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    backgroundColor: colors.muted,
    paddingInline: "1rem",
    paddingBlock: "0.625rem",
    fontFamily: fonts.mono,
    fontSize: "0.875rem",
    color: colors.mutedForeground,
  },
  copy: {
    flexShrink: 0,
    gap: "0.375rem",
  },
  tinyIcon: {
    width: "0.75rem",
    height: "0.75rem",
    flexShrink: 0,
  },
});

export function DeckShareButton({ slug, title }: DeckShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/slides/${slug}`
      : `/slides/${slug}`;

  const handleCopy = useCallback(async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/slides/${slug}`
        : `/slides/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [slug]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={stylex.props(styles.trigger).className}
          aria-label={`Share ${title}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Share2 {...stylex.props(icon.md)} />
        </Button>
      </DialogTrigger>
      <DialogContent className={stylex.props(styles.dialog).className}>
        <DialogHeader>
          <DialogTitle className={stylex.props(styles.title).className}>
            {title}
          </DialogTitle>
          <DialogDescription>
            Scan the QR code or copy the link to share this deck.
          </DialogDescription>
        </DialogHeader>

        <div {...stylex.props(styles.body)}>
          <div {...stylex.props(styles.qrWrap)}>
            <QRCode
              value={shareUrl}
              size={320}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
            />
          </div>

          <div {...stylex.props(styles.urlRow)}>
            <code {...stylex.props(styles.url)} title={shareUrl}>
              {shareUrl}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className={stylex.props(styles.copy).className}
            >
              {copied ? (
                <>
                  <Check {...stylex.props(styles.tinyIcon)} />
                  Copied
                </>
              ) : (
                <>
                  <Copy {...stylex.props(styles.tinyIcon)} />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
