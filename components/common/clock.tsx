import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Constants
const PADDING_LENGTH = 2;
const PADDING_CHAR = "0";
const NOON_HOUR = 12;
const MODULO_HOURS = 12;
const CLOCK_UPDATE_INTERVAL_MS = 1000;

const getTime = (): string => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours >= NOON_HOUR ? "PM" : "AM";
  hours = hours % MODULO_HOURS || NOON_HOUR;
  return `${hours.toString().padStart(PADDING_LENGTH, PADDING_CHAR)}:${minutes
    .toString()
    .padStart(
      PADDING_LENGTH,
      PADDING_CHAR
    )}:${seconds.toString().padStart(PADDING_LENGTH, PADDING_CHAR)} ${ampm}`;
};

type ClockProps = {
  className?: string;
};

export function Clock({ className }: ClockProps) {
  const [time, setTime] = useState(getTime());

  useEffect(() => {
    const interval = setInterval(
      () => setTime(getTime()),
      CLOCK_UPDATE_INTERVAL_MS
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn("font-mono text-sm", className)}
      suppressHydrationWarning
    >
      {time}
    </div>
  );
}
