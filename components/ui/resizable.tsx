"use client";

import { GripVerticalIcon } from "lucide-react";
import * as stylex from "@stylexjs/stylex";
import type * as React from "react";
import * as ResizablePrimitive from "react-resizable-panels";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  group: {
    display: "flex",
    height: "100%",
    width: "100%",
    ":is([data-panel-group-direction=vertical])": {
      flexDirection: "column",
    },
  },
  handle: {
    position: "relative",
    display: "flex",
    width: "1px",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.border,
    ":focus-visible": {
      outline: "none",
      boxShadow: `0 0 0 1px ${colors.ring}`,
    },
    ":is([data-panel-group-direction=vertical])": {
      height: "1px",
      width: "100%",
    },
  },
  handleInner: {
    zIndex: 10,
    display: "flex",
    height: "1rem",
    width: "0.75rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.sm,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    backgroundColor: colors.border,
  },
  icon: {
    width: "0.625rem",
    height: "0.625rem",
  },
});

function ResizablePanelGroup({
  className,
  style,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
  return (
    <ResizablePrimitive.PanelGroup
      data-slot="resizable-panel-group"
      {...mergeSx(stylex.props(styles.group), className, style)}
      {...props}
    />
  );
}

function ResizablePanel({
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({
  withHandle,
  className,
  style,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
}) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="resizable-handle"
      {...mergeSx(stylex.props(styles.handle), className, style)}
      {...props}
    >
      {withHandle && (
        <div {...stylex.props(styles.handleInner)}>
          <GripVerticalIcon {...stylex.props(styles.icon)} />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
