import * as stylex from "@stylexjs/stylex";
import Link from "next/link";
import { FaFile, FaFilePdf, FaFilePowerpoint, FaGithub } from "react-icons/fa6";
import type { PostAttachment } from "@/lib/blog";
import { colors, fonts, radii } from "@/lib/stylex/tokens.stylex";

type AttachmentListProps = {
  attachments: PostAttachment[];
};

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: `color-mix(in oklch, ${colors.border}, transparent 40%)`,
    paddingTop: "2rem",
  },
  heading: {
    fontFamily: fonts.display,
    fontWeight: 500,
    fontSize: "0.875rem",
    color: colors.foreground,
    textWrap: "balance",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: `color-mix(in oklch, ${colors.border}, transparent 50%)`,
    backgroundColor: `color-mix(in oklch, ${colors.muted}, transparent 70%)`,
    padding: "0.75rem",
    transitionProperty: "color, background-color, border-color",
    transitionDuration: "150ms",
    ":hover": {
      borderColor: `color-mix(in oklch, ${colors.accent}, transparent 50%)`,
      backgroundColor: `color-mix(in oklch, ${colors.muted}, transparent 50%)`,
    },
  },
  icon: {
    width: "1.25rem",
    height: "1.25rem",
    flexShrink: 0,
    color: colors.accent,
  },
  text: {
    minWidth: 0,
    flex: 1,
  },
  title: {
    fontWeight: 500,
    color: colors.foreground,
    ":hover": {
      color: colors.accent,
    },
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    color: colors.mutedForeground,
  },
});

function getAttachmentIcon(type?: string) {
  switch (type) {
    case "pdf":
      return FaFilePdf;
    case "repo":
      return FaGithub;
    case "slides":
      return FaFilePowerpoint;
    default:
      return FaFile;
  }
}

function getAttachmentLabel(type?: string) {
  switch (type) {
    case "pdf":
      return "PDF";
    case "repo":
      return "Repository";
    case "slides":
      return "Slides";
    default:
      return "File";
  }
}

export function AttachmentList({ attachments }: AttachmentListProps) {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div {...stylex.props(styles.root)}>
      <h3 {...stylex.props(styles.heading)}>Attachments</h3>
      <ul {...stylex.props(styles.list)}>
        {attachments.map((attachment) => {
          const Icon = getAttachmentIcon(attachment.type);
          const label = getAttachmentLabel(attachment.type);

          return (
            <li key={attachment.url}>
              <Link
                aria-label={`Open ${attachment.title} (${label})`}
                href={attachment.url}
                rel="noopener noreferrer"
                target="_blank"
                {...stylex.props(styles.link)}
              >
                <Icon {...stylex.props(styles.icon)} />
                <div {...stylex.props(styles.text)}>
                  <div {...stylex.props(styles.title)}>{attachment.title}</div>
                  {attachment.type && (
                    <div {...stylex.props(styles.label)}>{label}</div>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
