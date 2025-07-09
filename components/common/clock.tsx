import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const getTime = (): string => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

type ClockProps = {
  className?: string;
};

export function Clock({ className }: ClockProps) {
  const [time, setTime] = useState(getTime());

  useEffect(() => {
    const interval = setInterval(() => setTime(getTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  return <div className={cn('font-mono text-sm', className)}>{time}</div>;
}