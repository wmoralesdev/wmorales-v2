import { Slot } from "@radix-ui/react-slot";
import * as stylex from "@stylexjs/stylex";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  list: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "0.375rem",
    overflowWrap: "break-word",
    color: colors.mutedForeground,
    fontSize: "0.875rem",
    "@media (min-width: 640px)": {
      gap: "0.625rem",
    },
  },
  item: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.375rem",
  },
  link: {
    transitionProperty: "color",
    transitionDuration: "150ms",
    color: colors.mutedForeground,
    ":hover": {
      color: colors.foreground,
    },
  },
  page: {
    fontWeight: 400,
    color: colors.foreground,
  },
  separator: {
    display: "flex",
    alignItems: "center",
  },
  separatorIcon: {
    width: "0.875rem",
    height: "0.875rem",
  },
  ellipsis: {
    display: "flex",
    width: "2.25rem",
    height: "2.25rem",
    alignItems: "center",
    justifyContent: "center",
  },
  ellipsisIcon: {
    width: "1rem",
    height: "1rem",
  },
});

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({
  className,
  style,
  ...props
}: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      {...mergeSx(stylex.props(styles.list), className, style)}
      {...props}
    />
  );
}

function BreadcrumbItem({
  className,
  style,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      {...mergeSx(stylex.props(styles.item), className, style)}
      {...props}
    />
  );
}

function BreadcrumbLink({
  asChild,
  className,
  style,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="breadcrumb-link"
      {...mergeSx(stylex.props(styles.link), className, style)}
      {...props}
    />
  );
}

function BreadcrumbPage({
  className,
  style,
  ...props
}: React.ComponentProps<"span">) {
  return (
    // biome-ignore lint/a11y/useFocusableInteractive: shadcn convention
    <span
      aria-current="page"
      aria-disabled="true"
      data-slot="breadcrumb-page"
      role="link"
      {...mergeSx(stylex.props(styles.page), className, style)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({
  children,
  className,
  style,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      aria-hidden="true"
      data-slot="breadcrumb-separator"
      role="presentation"
      {...mergeSx(stylex.props(styles.separator), className, style)}
      {...props}
    >
      {children ?? <ChevronRight {...stylex.props(styles.separatorIcon)} />}
    </li>
  );
}

function BreadcrumbEllipsis({
  className,
  style,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      {...mergeSx(stylex.props(styles.ellipsis), className, style)}
      {...props}
    >
      <MoreHorizontal {...stylex.props(styles.ellipsisIcon)} />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
