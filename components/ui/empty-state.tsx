import type * as React from "react";

import { cn } from "@/lib/utils";

function EmptyState({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-border bg-background p-8 text-center",
        className,
      )}
      data-slot="empty-state"
      {...props}
    />
  );
}

function EmptyStateIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mb-4 inline-flex size-12 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground",
        className,
      )}
      data-slot="empty-state-icon"
      {...props}
    />
  );
}

function EmptyStateTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "font-display text-base font-semibold tracking-tight text-foreground",
        className,
      )}
      data-slot="empty-state-title"
      {...props}
    />
  );
}

function EmptyStateDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("mt-1 text-sm text-muted-foreground text-pretty", className)}
      data-slot="empty-state-description"
      {...props}
    />
  );
}

function EmptyStateActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-5 flex flex-wrap justify-center gap-2", className)}
      data-slot="empty-state-actions"
      {...props}
    />
  );
}

export {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
};
