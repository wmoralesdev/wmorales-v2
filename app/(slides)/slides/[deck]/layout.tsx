import * as stylex from "@stylexjs/stylex";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { icon } from "@/lib/stylex/icons";
import { colors } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  root: {
    backgroundColor: colors.background,
  },
  header: {
    position: "fixed",
    insetInline: 0,
    top: 0,
    zIndex: 40,
    display: "flex",
    height: "3rem",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
    paddingInline: "1rem",
  },
  back: {
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
    fontSize: "0.875rem",
    color: colors.mutedForeground,
    transitionProperty: "color",
    transitionDuration: "150ms",
    ":hover": {
      color: colors.foreground,
    },
  },
  content: {
    paddingTop: "3rem",
  },
});

export default function DeckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div {...stylex.props(styles.root)}>
      <header {...stylex.props(styles.header)}>
        <Link href="/slides" {...stylex.props(styles.back)}>
          <ArrowLeft {...stylex.props(icon.md)} />
          All Decks
        </Link>
      </header>
      <div {...stylex.props(styles.content)}>{children}</div>
    </div>
  );
}
