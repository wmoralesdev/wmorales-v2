import * as stylex from "@stylexjs/stylex";
import { MinimalHeader } from "@/components/landing/minimal-header";

const styles = stylex.create({
  shell: {
    marginInline: "auto",
    maxWidth: "42rem",
    paddingInline: "1.5rem",
    paddingBlock: "4rem",
    "@media (min-width: 768px)": {
      paddingBlock: "6rem",
    },
  },
  stack: {
    display: "flex",
    flexDirection: "column",
    gap: "3rem",
  },
});

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div {...stylex.props(styles.shell)}>
      <div {...stylex.props(styles.stack)}>
        <MinimalHeader />
        {children}
      </div>
    </div>
  );
}
