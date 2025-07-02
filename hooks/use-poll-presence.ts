import { useEffect, useRef } from 'react';
import { broadcastActiveUsers } from '@/lib/supabase/realtime';

export function usePollPresence(pollCode: string, activeUsersCount: number) {
  const broadcastIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastCountRef = useRef<number>(0);

  useEffect(() => {
    // Broadcast active users count immediately if it changed
    if (activeUsersCount !== lastCountRef.current) {
      broadcastActiveUsers(pollCode, activeUsersCount);
      lastCountRef.current = activeUsersCount;
    }

    // Set up interval to broadcast periodically
    broadcastIntervalRef.current = setInterval(() => {
      broadcastActiveUsers(pollCode, activeUsersCount);
    }, 10_000); // Broadcast every 10 seconds

    return () => {
      if (broadcastIntervalRef.current) {
        clearInterval(broadcastIntervalRef.current);
      }
      // Broadcast 0 users when leaving
      broadcastActiveUsers(pollCode, 0);
    };
  }, [pollCode, activeUsersCount]);
}
