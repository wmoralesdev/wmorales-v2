"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Constants
const COPY_SUCCESS_TIMEOUT_MS = 2000;
const FALLBACK_TEXTAREA_OFFSET = -999999;

type CopyButtonProps = {
  code: string;
};

export function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      // Check if clipboard API is available
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), COPY_SUCCESS_TIMEOUT_MS);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "fixed";
        textArea.style.left = `${FALLBACK_TEXTAREA_OFFSET}px`;
        textArea.style.top = `${FALLBACK_TEXTAREA_OFFSET}px`;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand("copy");
          setCopied(true);
          setTimeout(() => setCopied(false), COPY_SUCCESS_TIMEOUT_MS);
        } catch (err) {
          console.error("Copy failed:", err);
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      console.error("Copy failed:", err);
      // Try the fallback method
      try {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "fixed";
        textArea.style.left = `${FALLBACK_TEXTAREA_OFFSET}px`;
        textArea.style.top = `${FALLBACK_TEXTAREA_OFFSET}px`;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), COPY_SUCCESS_TIMEOUT_MS);

        document.body.removeChild(textArea);
      } catch (fallbackErr) {
        console.error("Fallback copy failed:", fallbackErr);
      }
    }
  };

  return (
    <Button
      className="h-8 w-8 text-gray-400 transition-colors hover:text-white"
      onClick={copyToClipboard}
      size="sm"
      title={copied ? "Copied!" : "Copy code"}
      variant="ghost"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-400" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}
