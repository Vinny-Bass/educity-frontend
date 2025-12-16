import LeaderboardView from "@/features/student/leaderboard/components/LeaderboardView";
import { getLeaderboard } from "@/features/student/leaderboard/queries";
import { requireAuth } from "@/lib/auth";

export default async function LeaderboardPage() {
  const user = await requireAuth();
  const leaderboardData = await getLeaderboard();

  return (
    <LeaderboardView data={leaderboardData} currentUserId={user.id} />
  );
}

