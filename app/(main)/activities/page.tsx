import * as stylex from "@stylexjs/stylex";
import type { Metadata } from "next";
import { ActivityAdminCreateDialog } from "@/components/activities/activity-admin-create-dialog";
import { ActivityCalendar } from "@/components/activities/activity-calendar";
import { NextActivityBanner } from "@/components/activities/next-activity-banner";
import { getAllActivities, getUpcomingActivities } from "@/lib/activities";

export const metadata: Metadata = {
  title: "Activities | Walter Morales",
  description: "Upcoming and past events, workshops, and meetups.",
};

export const dynamic = "force-dynamic";

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "3rem",
  },
});

export default async function ActivitiesPage() {
  const activities = await getAllActivities();
  const upcomingActivities = await getUpcomingActivities(3);
  const now = new Date();

  return (
    <div {...stylex.props(styles.root)}>
      <NextActivityBanner
        activities={JSON.parse(JSON.stringify(upcomingActivities))}
      />
      <ActivityCalendar
        activities={JSON.parse(JSON.stringify(activities))}
        initialYear={now.getFullYear()}
        initialMonth={now.getMonth() + 1}
      />
      <ActivityAdminCreateDialog />
    </div>
  );
}
