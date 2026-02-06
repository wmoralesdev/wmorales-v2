import "server-only";

// Re-export from db layer for backward compatibility
export type { ActivityRecord } from "@/lib/db/activities";
export {
  getActivitiesByMonth,
  getAllActivities,
  getNextActivity,
  getUpcomingActivities,
} from "@/lib/db/activities";
