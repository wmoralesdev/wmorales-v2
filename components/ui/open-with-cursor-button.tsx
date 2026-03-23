import type * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type OpenWithCursorButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "asChild" | "children"
> & {
  prompt: string;
  title?: string;
  children?: React.ReactNode;
};

function OpenWithCursorButton({
  className,
  prompt,
  title,
  variant = "outline",
  size = "sm",
  children = "Open with Cursor",
  ...props
}: OpenWithCursorButtonProps) {
  const text = title ? `${title}\n\n${prompt}` : prompt;
  const href = `https://cursor.com/link/prompt?text=${encodeURIComponent(text)}`;

  return (
    <Button
      {...props}
      asChild
      className={cn("gap-1.5", className)}
      size={size}
      variant={variant}
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </Button>
  );
}

export { OpenWithCursorButton };
