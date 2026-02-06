"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

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
    <span className="flex items-center gap-1.5 font-mono text-muted-foreground/80 text-sm">
      <Icon className="size-3.5 shrink-0" />
      {time}
    </span>
  );
}
