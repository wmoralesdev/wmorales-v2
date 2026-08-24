/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as stylex from "@stylexjs/stylex";
import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, fonts, radii } from "@/lib/stylex/tokens.stylex";

const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (typeof payload !== "object" || payload === null) {
    return;
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

const styles = stylex.create({
  container: {
    display: "flex",
    aspectRatio: "16 / 9",
    justifyContent: "center",
    fontSize: "0.75rem",
  },
  tooltip: {
    display: "grid",
    minWidth: "8rem",
    alignItems: "flex-start",
    gap: "0.375rem",
    borderRadius: radii.lg,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: `color-mix(in oklch, ${colors.border}, transparent 50%)`,
    backgroundColor: colors.background,
    paddingInline: "0.625rem",
    paddingBlock: "0.375rem",
    fontSize: "0.75rem",
    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  },
  tooltipLabel: {
    fontWeight: 500,
  },
  tooltipRows: {
    display: "grid",
    gap: "0.375rem",
  },
  tooltipRow: {
    display: "flex",
    width: "100%",
    flexWrap: "wrap",
    alignItems: "stretch",
    gap: "0.5rem",
  },
  tooltipRowDot: {
    alignItems: "center",
  },
  indicator: {
    flexShrink: 0,
    borderRadius: "2px",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "var(--color-border)",
    backgroundColor: "var(--color-bg)",
  },
  indicatorDot: {
    height: "0.625rem",
    width: "0.625rem",
  },
  indicatorLine: {
    width: "0.25rem",
  },
  indicatorDashed: {
    width: 0,
    borderWidth: "1.5px",
    borderStyle: "dashed",
    backgroundColor: "transparent",
  },
  indicatorDashedNested: {
    marginBlock: "0.125rem",
  },
  tooltipValueRow: {
    display: "flex",
    flex: 1,
    justifyContent: "space-between",
    lineHeight: 1,
  },
  tooltipValueEnd: {
    alignItems: "flex-end",
  },
  tooltipValueCenter: {
    alignItems: "center",
  },
  tooltipValueStack: {
    display: "grid",
    gap: "0.375rem",
  },
  tooltipMuted: {
    color: colors.mutedForeground,
  },
  tooltipValue: {
    fontWeight: 500,
    fontFamily: fonts.mono,
    color: colors.foreground,
    fontVariantNumeric: "tabular-nums",
  },
  legend: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  },
  legendTop: {
    paddingBottom: "0.75rem",
  },
  legendBottom: {
    paddingTop: "0.75rem",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
  },
  legendSwatch: {
    height: "0.5rem",
    width: "0.5rem",
    flexShrink: 0,
    borderRadius: "2px",
  },
});

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config2]) => config2.theme || config2.color,
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      // biome-ignore lint/security/noDangerouslySetInnerHtml: shadcn convention
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  );
};

function ChartContainer({
  id,
  className,
  children,
  config,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        data-slot="chart"
        {...mergeSx(stylex.props(styles.container), className, style)}
        {...props}
      >
        <ChartStyle config={config} id={chartId} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent({
  active,
  payload = [],
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
  style,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
    label: string;
    // biome-ignore lint/suspicious/noExplicitAny: lib controlled
    payload: any;
  }) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === "string"
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div
          {...mergeSx(stylex.props(styles.tooltipLabel), labelClassName)}
        >
          {labelFormatter(value, payload)}
        </div>
      );
    }

    if (!value) {
      return null;
    }

    return (
      <div {...mergeSx(stylex.props(styles.tooltipLabel), labelClassName)}>
        {value}
      </div>
    );
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ]);

  if (!(active && payload?.length)) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div {...mergeSx(stylex.props(styles.tooltip), className, style)}>
      {nestLabel ? null : tooltipLabel}
      <div {...stylex.props(styles.tooltipRows)}>
        {payload.map((item: any, index: number) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor = color || item.payload.fill || item.color;

          return (
            <div
              key={item.dataKey}
              {...stylex.props(
                styles.tooltipRow,
                indicator === "dot" && styles.tooltipRowDot,
              )}
            >
              {formatter && item?.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, item.payload)
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        {...stylex.props(
                          styles.indicator,
                          indicator === "dot" && styles.indicatorDot,
                          indicator === "line" && styles.indicatorLine,
                          indicator === "dashed" && styles.indicatorDashed,
                          nestLabel &&
                            indicator === "dashed" &&
                            styles.indicatorDashedNested,
                        )}
                        style={
                          {
                            "--color-bg": indicatorColor,
                            "--color-border": indicatorColor,
                          } as React.CSSProperties
                        }
                      />
                    )
                  )}
                  <div
                    {...stylex.props(
                      styles.tooltipValueRow,
                      nestLabel
                        ? styles.tooltipValueEnd
                        : styles.tooltipValueCenter,
                    )}
                  >
                    <div {...stylex.props(styles.tooltipValueStack)}>
                      {nestLabel ? tooltipLabel : null}
                      <span {...stylex.props(styles.tooltipMuted)}>
                        {itemConfig?.label || item.name}
                      </span>
                    </div>
                    {item.value && (
                      <span {...stylex.props(styles.tooltipValue)}>
                        {item.value.toLocaleString()}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
  style,
}: React.ComponentProps<"div"> &
  Pick<RechartsPrimitive.LegendProps, "verticalAlign"> & {
    // biome-ignore lint/suspicious/noExplicitAny: lib controlled
    payload: any;
    hideIcon?: boolean;
    nameKey?: string;
  }) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      {...mergeSx(
        stylex.props(
          styles.legend,
          verticalAlign === "top" ? styles.legendTop : styles.legendBottom,
        ),
        className,
        style,
      )}
    >
      {/** biome-ignore lint/suspicious/noExplicitAny: lib controlled */}
      {payload.map((item: any) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div key={item.value} {...stylex.props(styles.legendItem)}>
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                {...stylex.props(styles.legendSwatch)}
                style={{
                  backgroundColor: item.color,
                }}
              />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
