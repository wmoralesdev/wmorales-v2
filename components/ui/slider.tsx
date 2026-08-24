/* eslint-disable @typescript-eslint/naming-convention */
"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as stylex from "@stylexjs/stylex";
import * as React from "react";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  root: {
    position: "relative",
    display: "flex",
    width: "100%",
    touchAction: "none",
    userSelect: "none",
    alignItems: "center",
    ":is([data-orientation=vertical])": {
      height: "100%",
      minHeight: "11rem",
      width: "auto",
      flexDirection: "column",
    },
    ":is([data-disabled])": {
      opacity: 0.5,
    },
  },
  track: {
    position: "relative",
    flexGrow: 1,
    overflow: "hidden",
    borderRadius: radii.full,
    backgroundColor: colors.muted,
    ":is([data-orientation=horizontal])": {
      height: "0.375rem",
      width: "100%",
    },
    ":is([data-orientation=vertical])": {
      height: "100%",
      width: "0.375rem",
    },
  },
  range: {
    position: "absolute",
    backgroundColor: colors.primary,
    ":is([data-orientation=horizontal])": {
      height: "100%",
    },
    ":is([data-orientation=vertical])": {
      width: "100%",
    },
  },
  thumb: {
    display: "block",
    width: "1rem",
    height: "1rem",
    flexShrink: 0,
    borderRadius: radii.full,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.primary,
    backgroundColor: colors.background,
    boxShadow: `0 0 0 0 color-mix(in oklch, ${colors.ring}, transparent 50%)`,
    transitionProperty: "color, box-shadow",
    transitionDuration: "150ms",
    ":hover": {
      boxShadow: `0 0 0 4px color-mix(in oklch, ${colors.ring}, transparent 50%)`,
    },
    ":focus-visible": {
      outline: "none",
      boxShadow: `0 0 0 4px color-mix(in oklch, ${colors.ring}, transparent 50%)`,
    },
    ":disabled": {
      pointerEvents: "none",
      opacity: 0.5,
    },
  },
});

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  style,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(() => {
    if (Array.isArray(value)) {
      return value;
    }
    if (Array.isArray(defaultValue)) {
      return defaultValue;
    }
    return [min, max];
  }, [value, defaultValue, min, max]);

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      max={max}
      min={min}
      value={value}
      {...mergeSx(stylex.props(styles.root), className, style)}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        {...stylex.props(styles.track)}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          {...stylex.props(styles.range)}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          // biome-ignore lint/suspicious/noArrayIndexKey: shadcn convention
          key={index}
          {...stylex.props(styles.thumb)}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
