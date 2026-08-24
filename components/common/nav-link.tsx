"use client";

import * as stylex from "@stylexjs/stylex";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, radii } from "@/lib/stylex/tokens.stylex";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  exact?: boolean;
};

const styles = stylex.create({
  base: {
    position: "relative",
    borderRadius: radii.md,
    paddingInline: "0.5rem",
    paddingBlock: "0.25rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    transitionProperty: "color, background-color",
    transitionDuration: "150ms",
    ":focus-visible": {
      outline: "none",
      boxShadow: `0 0 0 1px ${colors.ring}`,
    },
  },
  active: {
    backgroundColor: `color-mix(in oklch, ${colors.accent}, transparent 90%)`,
    color: colors.accent,
  },
  inactive: {
    color: colors.mutedForeground,
    ":hover": {
      backgroundColor: `color-mix(in oklch, ${colors.muted}, transparent 50%)`,
      color: colors.foreground,
    },
  },
});

export function NavLink({
  href,
  children,
  className,
  exact = false,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      {...mergeSx(
        stylex.props(styles.base, isActive ? styles.active : styles.inactive),
        className,
      )}
    >
      {children}
    </Link>
  );
}
