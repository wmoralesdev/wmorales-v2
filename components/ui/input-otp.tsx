"use client";

import { OTPInput, OTPInputContext } from "input-otp";
import * as stylex from "@stylexjs/stylex";
import { MinusIcon } from "lucide-react";
import * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const caretBlink = stylex.keyframes({
  "0%, 70%, 100%": { opacity: 1 },
  "20%, 50%": { opacity: 0 },
});

const styles = stylex.create({
  input: {
    ":disabled": {
      cursor: "not-allowed",
    },
  },
  container: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    ":has(:disabled)": {
      opacity: 0.5,
    },
  },
  group: {
    display: "flex",
    alignItems: "center",
  },
  slot: {
    position: "relative",
    display: "flex",
    height: "2.25rem",
    width: "2.25rem",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderStyle: "solid",
    borderColor: colors.input,
    fontSize: "0.875rem",
    boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
    outline: "none",
    transitionProperty: "all",
    transitionDuration: "150ms",
    ":first-child": {
      borderTopLeftRadius: radii.md,
      borderBottomLeftRadius: radii.md,
      borderLeftWidth: 1,
    },
    ":last-child": {
      borderTopRightRadius: radii.md,
      borderBottomRightRadius: radii.md,
    },
    ":is([aria-invalid=true])": {
      borderColor: colors.destructive,
    },
    ":is([data-active=true])": {
      zIndex: 10,
      borderColor: colors.ring,
      boxShadow: `0 0 0 3px color-mix(in oklch, ${colors.ring}, transparent 50%)`,
    },
  },
  caretWrap: {
    pointerEvents: "none",
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  caret: {
    height: "1rem",
    width: "1px",
    backgroundColor: colors.foreground,
    animationName: caretBlink,
    animationDuration: "1000ms",
    animationIterationCount: "infinite",
  },
});

function InputOTP({
  className,
  containerClassName,
  style,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      containerClassName={
        mergeSx(stylex.props(styles.container), containerClassName).className
      }
      data-slot="input-otp"
      {...mergeSx(stylex.props(styles.input), className, style)}
      {...props}
    />
  );
}

function InputOTPGroup({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      {...mergeSx(stylex.props(styles.group), className, style)}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-active={isActive}
      data-slot="input-otp-slot"
      {...mergeSx(stylex.props(styles.slot), className, style)}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div {...stylex.props(styles.caretWrap)}>
          <div {...stylex.props(styles.caret)} />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    // biome-ignore lint/a11y/useFocusableInteractive: shadcn convention
    // biome-ignore lint/a11y/useAriaPropsForRole: shadcn convention
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
