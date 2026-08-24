"use client";

import * as stylex from "@stylexjs/stylex";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  container: {
    position: "relative",
    width: "100%",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    captionSide: "bottom",
    fontSize: "0.875rem",
  },
  footer: {
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: colors.border,
    backgroundColor: `color-mix(in oklch, ${colors.muted}, transparent 50%)`,
    fontWeight: 500,
  },
  row: {
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.border,
    transitionProperty: "background-color",
    transitionDuration: "150ms",
    ":hover": {
      backgroundColor: `color-mix(in oklch, ${colors.muted}, transparent 50%)`,
    },
    ":is([data-state=selected])": {
      backgroundColor: colors.muted,
    },
  },
  head: {
    height: "2.5rem",
    whiteSpace: "nowrap",
    paddingInline: "0.5rem",
    textAlign: "left",
    verticalAlign: "middle",
    fontWeight: 500,
    color: colors.foreground,
  },
  cell: {
    whiteSpace: "nowrap",
    padding: "0.5rem",
    verticalAlign: "middle",
  },
  caption: {
    marginTop: "1rem",
    color: colors.mutedForeground,
    fontSize: "0.875rem",
  },
});

function Table({
  className,
  style,
  ...props
}: React.ComponentProps<"table">) {
  return (
    <div data-slot="table-container" {...stylex.props(styles.container)}>
      <table
        data-slot="table"
        {...mergeSx(stylex.props(styles.table), className, style)}
        {...props}
      />
    </div>
  );
}

function TableHeader({
  className,
  style,
  ...props
}: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      {...mergeSx({}, className, style)}
      {...props}
    />
  );
}

function TableBody({
  className,
  style,
  ...props
}: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      {...mergeSx({}, className, style)}
      {...props}
    />
  );
}

function TableFooter({
  className,
  style,
  ...props
}: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      {...mergeSx(stylex.props(styles.footer), className, style)}
      {...props}
    />
  );
}

function TableRow({ className, style, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      {...mergeSx(stylex.props(styles.row), className, style)}
      {...props}
    />
  );
}

function TableHead({ className, style, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      {...mergeSx(stylex.props(styles.head), className, style)}
      {...props}
    />
  );
}

function TableCell({ className, style, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      {...mergeSx(stylex.props(styles.cell), className, style)}
      {...props}
    />
  );
}

function TableCaption({
  className,
  style,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      {...mergeSx(stylex.props(styles.caption), className, style)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
