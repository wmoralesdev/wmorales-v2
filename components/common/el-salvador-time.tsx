"use client";

import * as stylex from "@stylexjs/stylex";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { colors, fonts } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  time: {
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
    fontFamily: fonts.mono,
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 20%)`,
    fontSize: "0.875rem",
  },
  icon: {
    width: "0.875rem",
    height: "0.875rem",
    flexShrink: 0,
  },
});

export function ElSalvadorTime() {
  const [time, setTime] = useState<string>("");
  const [hour, setHour] = useState<number>(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/El_Salvador",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const hourFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/El_Salvador",
        hour: "numeric",
        hour12: false,
      });
      setTime(formatter.format(now));
      setHour(Number.parseInt(hourFormatter.format(now), 10));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  const isDaytime = hour >= 6 && hour < 18;
  const Icon = isDaytime ? Sun : Moon;

  return (
    <span {...stylex.props(styles.time)}>
      <Icon {...stylex.props(styles.icon)} />
      {time}
    </span>
  );
}
