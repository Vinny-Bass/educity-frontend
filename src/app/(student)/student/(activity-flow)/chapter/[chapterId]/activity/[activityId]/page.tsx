import { ActivityDetailView } from "@/features/student/activity/components/ActivityDetailView";
import { getActivity } from "@/features/student/activity/queries";
import { ActivityStub } from "@/features/student/activity/types";

interface StudentActivityPageProps {
  params: Promise<{
    activityId: string;
  }>;
}

export default async function ActivityPage({
  params,
}: StudentActivityPageProps) {
  const { activityId: activityIdParam } = await params;
  const activityId = activityIdParam;

  let activity: ActivityStub | null = null;
  try {
    activity = await getActivity(activityId);
  } catch (error) {
    console.error(error);
    return <div>Error loading activity</div>;
  }

  return <ActivityDetailView activity={activity} />;
}
