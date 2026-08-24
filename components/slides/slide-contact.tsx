import * as stylex from "@stylexjs/stylex";
import { Globe, Mail, Phone, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { icon } from "@/lib/stylex/icons";
import { mergeSx } from "@/lib/stylex/sx";
import { colors } from "@/lib/stylex/tokens.stylex";

interface ContactInfo {
  name?: string;
  email: string;
  website?: string;
  phone?: string;
}

interface SlideContactProps {
  contact: ContactInfo;
  className?: string;
  compact?: boolean;
}

const styles = stylex.create({
  card: {
    borderColor: `color-mix(in oklch, ${colors.border}, transparent 40%)`,
    backgroundColor: `color-mix(in oklch, ${colors.muted}, transparent 80%)`,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    padding: "1.5rem",
  },
  contentCompact: {
    gap: "0.625rem",
    padding: "1rem",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  rowCompact: {
    gap: "0.625rem",
  },
  icon: {
    color: colors.mutedForeground,
  },
  iconCompact: {
    width: "0.875rem",
    height: "0.875rem",
    flexShrink: 0,
    color: colors.mutedForeground,
  },
  name: {
    fontWeight: 500,
    color: colors.foreground,
  },
  nameCompact: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: colors.foreground,
  },
  link: {
    color: colors.accent,
    textUnderlineOffset: "2px",
    ":hover": {
      textDecoration: "underline",
    },
  },
  linkCompact: {
    fontSize: "0.875rem",
  },
});

/**
 * SlideContact renders contact information in a card format.
 * Used in CTA slides.
 */
export function SlideContact({
  contact,
  className,
  compact = false,
}: SlideContactProps) {
  return (
    <Card className={mergeSx(stylex.props(styles.card), className).className}>
      <CardContent
        className={
          stylex.props(styles.content, compact && styles.contentCompact)
            .className
        }
      >
        {contact.name && (
          <div {...stylex.props(styles.row, compact && styles.rowCompact)}>
            <User
              {...stylex.props(
                compact ? styles.iconCompact : icon.md,
                !compact && styles.icon,
              )}
            />
            <span {...stylex.props(compact ? styles.nameCompact : styles.name)}>
              {contact.name}
            </span>
          </div>
        )}
        <div {...stylex.props(styles.row, compact && styles.rowCompact)}>
          <Mail
            {...stylex.props(
              compact ? styles.iconCompact : icon.md,
              !compact && styles.icon,
            )}
          />
          <a
            href={`mailto:${contact.email}`}
            {...stylex.props(styles.link, compact && styles.linkCompact)}
          >
            {contact.email}
          </a>
        </div>
        {contact.website && (
          <div {...stylex.props(styles.row, compact && styles.rowCompact)}>
            <Globe
              {...stylex.props(
                compact ? styles.iconCompact : icon.md,
                !compact && styles.icon,
              )}
            />
            <a
              href={contact.website}
              target="_blank"
              rel="noopener noreferrer"
              {...stylex.props(styles.link, compact && styles.linkCompact)}
            >
              {contact.website}
            </a>
          </div>
        )}
        {contact.phone && (
          <div {...stylex.props(styles.row, compact && styles.rowCompact)}>
            <Phone
              {...stylex.props(
                compact ? styles.iconCompact : icon.md,
                !compact && styles.icon,
              )}
            />
            <a
              href={`tel:${contact.phone}`}
              {...stylex.props(styles.link, compact && styles.linkCompact)}
            >
              {contact.phone}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
