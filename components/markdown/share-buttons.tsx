"use client";

import { Facebook, Link2, Linkedin, Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ShareButtonsProps = {
  title: string;
  url: string;
};

export function ShareButtons({ title, url }: ShareButtonsProps) {
  // Hydration-safe: compute shareUrl on client only
  const [shareUrl, setShareUrl] = useState<string>(url);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}${url}`);
    }
  }, [url]);

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-gray-400 text-sm">Share this post:</span>
      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline">
          <a
            aria-label="Share on Twitter"
            href={shareLinks.twitter}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Twitter className="h-4 w-4" />
          </a>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a
            aria-label="Share on Facebook"
            href={shareLinks.facebook}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Facebook className="h-4 w-4" />
          </a>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a
            aria-label="Share on LinkedIn"
            href={shareLinks.linkedin}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </Button>
        <Button
          aria-label="Copy link"
          onClick={copyToClipboard}
          size="sm"
          variant="outline"
        >
          <Link2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
