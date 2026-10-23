import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react";

export function Icon({
  size = 20,
  strokeWidth = 1.8,
  ...props
}: HugeiconsIconProps) {
  return (
    <HugeiconsIcon
      aria-hidden="true"
      size={size}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}
