import type { CSSProperties } from "react";

type StylexProps = {
  className?: string;
  style?: CSSProperties;
};

export function mergeSx(
  stylexProps: StylexProps,
  className?: string,
  style?: CSSProperties,
): StylexProps {
  const mergedClassName = [stylexProps.className, className]
    .filter(Boolean)
    .join(" ");

  const mergedStyle =
    stylexProps.style || style
      ? { ...stylexProps.style, ...style }
      : undefined;

  return {
    className: mergedClassName || undefined,
    style: mergedStyle,
  };
}
