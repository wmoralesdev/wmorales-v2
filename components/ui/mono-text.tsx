import { Slot } from "@radix-ui/react-slot";
import type * as React from "react";

import { cn } from "@/lib/utils";

type MonoTextProps = React.HTMLAttributes<HTMLElement> & {
  asChild?: boolean;
  variant?: "inline" | "block";
};

function MonoText({
  asChild = false,
  className,
  variant = "inline",
  ...props
}: MonoTextProps) {
  const Comp = asChild ? Slot : variant === "block" ? "pre" : "code";

  return (
    <Comp
      className={cn(
        variant === "inline" &&
          "rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground",
        variant === "block" &&
          "whitespace-pre-wrap rounded-lg border border-border/50 bg-muted/40 p-3 font-mono text-xs leading-relaxed text-foreground",
        className,
      )}
      data-slot="mono-text"
      {...props}
    />
  );
}

export { MonoText };
