import * as stylex from "@stylexjs/stylex";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, fonts, radii } from "@/lib/stylex/tokens.stylex";

interface SlideCardItem {
  title: string;
  subtitle?: string;
  description?: string;
  items?: string[];
}

interface SlideCardGridProps {
  cards: SlideCardItem[];
  className?: string;
}

const styles = stylex.create({
  grid: {
    display: "grid",
    gap: "1.5rem",
  },
  cols2: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
  cols3: {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  },
  cols4: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    "@media (min-width: 1024px)": {
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    },
  },
  card: {
    borderColor: `color-mix(in oklch, ${colors.border}, transparent 40%)`,
    backgroundColor: `color-mix(in oklch, ${colors.muted}, transparent 80%)`,
    transitionProperty: "border-color",
    transitionDuration: "150ms",
    ":hover": {
      borderColor: `color-mix(in oklch, ${colors.accent}, transparent 60%)`,
    },
  },
  accent: {
    height: "0.25rem",
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    backgroundColor: `color-mix(in oklch, ${colors.accent}, transparent 40%)`,
  },
  header: {
    paddingBottom: "0.5rem",
  },
  title: {
    fontFamily: fonts.display,
    fontSize: "1.125rem",
    fontWeight: 600,
    color: colors.foreground,
  },
  subtitle: {
    display: "inline-block",
    width: "fit-content",
    borderRadius: radii.full,
    backgroundColor: `color-mix(in oklch, ${colors.accent}, transparent 80%)`,
    paddingInline: "0.75rem",
    paddingBlock: "0.125rem",
    fontSize: "0.75rem",
    fontWeight: 500,
    color: colors.accent,
  },
  description: {
    fontSize: "0.875rem",
    lineHeight: 1.625,
    textWrap: "pretty",
    color: colors.mutedForeground,
  },
  items: {
    marginTop: "0.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },
  item: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.5rem",
    fontSize: "0.875rem",
    color: colors.mutedForeground,
  },
  dot: {
    marginTop: "0.375rem",
    width: "0.375rem",
    height: "0.375rem",
    flexShrink: 0,
    borderRadius: radii.full,
    backgroundColor: colors.accent,
  },
});

/**
 * SlideCardGrid renders a grid of content cards.
 * 2 cards: 50/50 split
 * 3 cards: 33/33/33 split
 * 4 cards: 2x2 grid or 25% each
 */
export function SlideCardGrid({ cards, className }: SlideCardGridProps) {
  return (
    <div
      {...mergeSx(
        stylex.props(
          styles.grid,
          cards.length === 2 && styles.cols2,
          cards.length === 3 && styles.cols3,
          cards.length >= 4 && styles.cols4,
        ),
        className,
      )}
    >
      {cards.map((card) => (
        <Card key={card.title} className={stylex.props(styles.card).className}>
          <div {...stylex.props(styles.accent)} />
          <CardHeader className={stylex.props(styles.header).className}>
            <CardTitle className={stylex.props(styles.title).className}>
              {card.title}
            </CardTitle>
            {card.subtitle && (
              <span {...stylex.props(styles.subtitle)}>{card.subtitle}</span>
            )}
          </CardHeader>
          <CardContent>
            {card.description && (
              <p {...stylex.props(styles.description)}>{card.description}</p>
            )}
            {card.items && card.items.length > 0 && (
              <ul {...stylex.props(styles.items)}>
                {card.items.map((item) => (
                  <li key={item} {...stylex.props(styles.item)}>
                    <span {...stylex.props(styles.dot)} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
