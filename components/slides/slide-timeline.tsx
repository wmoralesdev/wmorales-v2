import * as stylex from "@stylexjs/stylex";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, fonts, radii } from "@/lib/stylex/tokens.stylex";

interface TimelineEvent {
  title: string;
  description: string;
  metric?: string;
}

interface SlideTimelineProps {
  events: TimelineEvent[];
  className?: string;
  /**
   * Layout direction for the timeline.
   * - "horizontal": Events in a row (default, better for wide slides)
   * - "vertical": Events stacked vertically
   */
  direction?: "horizontal" | "vertical";
}

const styles = stylex.create({
  vertical: {
    display: "flex",
    flexDirection: "column",
  },
  verticalItem: {
    position: "relative",
    display: "flex",
    gap: "1.5rem",
    paddingBottom: "2rem",
    ":last-child": {
      paddingBottom: 0,
    },
  },
  verticalLine: {
    position: "absolute",
    left: "0.75rem",
    top: "2rem",
    height: "100%",
    width: 1,
    backgroundColor: colors.border,
  },
  verticalDot: {
    position: "relative",
    zIndex: 10,
    marginTop: "0.25rem",
    display: "flex",
    width: "1.5rem",
    height: "1.5rem",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.full,
    backgroundColor: colors.accent,
  },
  verticalDotInner: {
    width: "0.5rem",
    height: "0.5rem",
    borderRadius: radii.full,
    backgroundColor: colors.accentForeground,
  },
  verticalContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  verticalMetric: {
    fontFamily: fonts.mono,
    fontSize: "0.875rem",
    fontWeight: 500,
    color: colors.accent,
  },
  verticalTitle: {
    fontFamily: fonts.display,
    fontSize: "1.125rem",
    fontWeight: 600,
    color: colors.foreground,
  },
  verticalDescription: {
    fontSize: "0.875rem",
    lineHeight: 1.625,
    textWrap: "pretty",
    color: colors.mutedForeground,
  },
  horizontal: {
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
  },
  horizontalItem: {
    position: "relative",
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  horizontalLine: {
    position: "absolute",
    left: "50%",
    top: "0.75rem",
    height: "0.125rem",
    width: "100%",
    backgroundColor: `color-mix(in oklch, ${colors.accent}, transparent 70%)`,
  },
  horizontalDot: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    width: "1.75rem",
    height: "1.75rem",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.full,
    backgroundColor: colors.accent,
    boxShadow: `0 10px 15px -3px color-mix(in oklch, ${colors.accent}, transparent 80%)`,
  },
  horizontalDotInner: {
    width: "0.625rem",
    height: "0.625rem",
    borderRadius: radii.full,
    backgroundColor: colors.accentForeground,
  },
  horizontalContent: {
    marginTop: "1rem",
    textAlign: "center",
  },
  horizontalMetric: {
    display: "inline-block",
    borderRadius: radii.full,
    backgroundColor: `color-mix(in oklch, ${colors.accent}, transparent 80%)`,
    paddingInline: "0.75rem",
    paddingBlock: "0.125rem",
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    fontWeight: 500,
    color: colors.accent,
  },
  horizontalTitle: {
    marginTop: "0.5rem",
    fontFamily: fonts.display,
    fontSize: "1rem",
    fontWeight: 600,
    color: colors.foreground,
  },
  horizontalDescription: {
    marginTop: "0.25rem",
    fontSize: "0.875rem",
    lineHeight: 1.625,
    textWrap: "pretty",
    color: colors.mutedForeground,
  },
});

/**
 * SlideTimeline renders sequential events or milestones.
 * Max 4 events recommended for readability.
 */
export function SlideTimeline({
  events,
  className,
  direction = "horizontal",
}: SlideTimelineProps) {
  if (direction === "vertical") {
    return (
      <div {...mergeSx(stylex.props(styles.vertical), className)}>
        {events.map((event, index) => (
          <div
            key={`${event.title}-${event.description}`}
            {...stylex.props(styles.verticalItem)}
          >
            {index < events.length - 1 && (
              <div {...stylex.props(styles.verticalLine)} />
            )}
            <div {...stylex.props(styles.verticalDot)}>
              <div {...stylex.props(styles.verticalDotInner)} />
            </div>
            <div {...stylex.props(styles.verticalContent)}>
              {event.metric && (
                <span {...stylex.props(styles.verticalMetric)}>
                  {event.metric}
                </span>
              )}
              <h3 {...stylex.props(styles.verticalTitle)}>{event.title}</h3>
              <p {...stylex.props(styles.verticalDescription)}>
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div {...mergeSx(stylex.props(styles.horizontal), className)}>
      {events.map((event, index) => (
        <div
          key={`${event.title}-${event.description}`}
          {...stylex.props(styles.horizontalItem)}
        >
          {index < events.length - 1 && (
            <div {...stylex.props(styles.horizontalLine)} />
          )}
          <div {...stylex.props(styles.horizontalDot)}>
            <div {...stylex.props(styles.horizontalDotInner)} />
          </div>
          <div {...stylex.props(styles.horizontalContent)}>
            {event.metric && (
              <span {...stylex.props(styles.horizontalMetric)}>
                {event.metric}
              </span>
            )}
            <h3 {...stylex.props(styles.horizontalTitle)}>{event.title}</h3>
            <p {...stylex.props(styles.horizontalDescription)}>
              {event.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
