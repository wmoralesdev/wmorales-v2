import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import * as stylex from "@stylexjs/stylex";
import type * as React from "react";
import { type Button, buttonVariants } from "@/components/ui/button";
import { mergeSx } from "@/lib/stylex/sx";

const styles = stylex.create({
  nav: {
    marginInline: "auto",
    display: "flex",
    width: "100%",
    justifyContent: "center",
  },
  content: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "0.25rem",
  },
  previous: {
    gap: "0.25rem",
    paddingInline: "0.625rem",
  },
  next: {
    gap: "0.25rem",
    paddingInline: "0.625rem",
  },
  navLabel: {
    display: "none",
    "@media (min-width: 640px)": {
      display: "block",
    },
  },
  ellipsis: {
    display: "flex",
    width: "2.25rem",
    height: "2.25rem",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: "1rem",
    height: "1rem",
  },
});

function Pagination({
  className,
  style,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="pagination"
      data-slot="pagination"
      {...mergeSx(stylex.props(styles.nav), className, style)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  style,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      {...mergeSx(stylex.props(styles.content), className, style)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  style,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-active={isActive}
      data-slot="pagination-link"
      {...mergeSx(
        {
          className: buttonVariants({
            variant: isActive ? "outline" : "ghost",
            size,
          }),
        },
        className,
        style,
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  style,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      {...mergeSx(stylex.props(styles.previous), className, style)}
      {...props}
    >
      <ChevronLeftIcon />
      <span {...stylex.props(styles.navLabel)}>Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  style,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      {...mergeSx(stylex.props(styles.next), className, style)}
      {...props}
    >
      <span {...stylex.props(styles.navLabel)}>Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  style,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      {...mergeSx(stylex.props(styles.ellipsis), className, style)}
      {...props}
    >
      <MoreHorizontalIcon {...stylex.props(styles.icon)} />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
