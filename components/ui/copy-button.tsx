"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import type * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CopyButtonProps = Omit<
  React.ComponentProps<"button">,
  "children" | "onClick"
> & {
  value: string;
  label?: string;
  copiedLabel?: string;
  resetMs?: number;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  onCopied?: () => void;
};

async function copyToClipboard(value: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  // Fallback: best-effort for older browsers / non-secure contexts
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function CopyButton({
  className,
  value,
  label = "Copy",
  copiedLabel = "Copied",
  resetMs = 1500,
  variant = "outline",
  size = "sm",
  onCopied,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), resetMs);
    return () => window.clearTimeout(t);
  }, [copied, resetMs]);

  return (
    <Button
      {...props}
      className={cn(copied && "wm-pop", className)}
      onClick={async () => {
        await copyToClipboard(value);
        setCopied(true);
        onCopied?.();
      }}
      size={size}
      variant={variant}
    >
      {copied ? (
        <CheckIcon className="size-4" aria-hidden="true" />
      ) : (
        <CopyIcon className="size-4" aria-hidden="true" />
      )}
      <span className="sr-only" aria-live="polite">
        {copied ? copiedLabel : label}
      </span>
      <span aria-hidden="true">{copied ? copiedLabel : label}</span>
    </Button>
  );
}

export { CopyButton };
