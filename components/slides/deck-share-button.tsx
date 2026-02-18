"use client";

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

interface DeckShareButtonProps {
  slug: string;
  title: string;
}

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
          className="size-8"
          aria-label={`Share ${title}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Share2 className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90dvh] w-[92vw] max-w-4xl flex-col gap-6 overflow-auto sm:w-[88vw] md:w-[85vw]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl sm:text-2xl">
            {title}
          </DialogTitle>
          <DialogDescription>
            Scan the QR code or copy the link to share this deck.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 flex-col items-center justify-center gap-8 py-4">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <QRCode
              value={shareUrl}
              size={320}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
            />
          </div>

          <div className="flex w-full min-w-0 items-center gap-3">
            <code
              className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-lg border bg-muted px-4 py-2.5 font-mono text-sm text-muted-foreground"
              title={shareUrl}
            >
              {shareUrl}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="shrink-0 gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="size-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-3" />
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
