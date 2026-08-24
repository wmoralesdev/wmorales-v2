import * as stylex from "@stylexjs/stylex";
import type * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, fonts, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  kbd: {
    backgroundColor: colors.muted,
    color: colors.mutedForeground,
    pointerEvents: "none",
    display: "inline-flex",
    height: "1.25rem",
    width: "fit-content",
    minWidth: "1.25rem",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.25rem",
    borderRadius: radii.sm,
    paddingInline: "0.25rem",
    fontFamily: fonts.text,
    fontSize: "0.75rem",
    fontWeight: 500,
    userSelect: "none",
  },
  group: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
  },
});

function Kbd({ className, style, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      {...mergeSx(stylex.props(styles.kbd), className, style)}
      {...props}
    />
  );
}

function KbdGroup({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      {...mergeSx(stylex.props(styles.group), className, style)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup };
