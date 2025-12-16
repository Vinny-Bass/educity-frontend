import { fetchFromStrapi } from '@/lib/strapi';
import { LeaderboardData } from './types';

export async function getLeaderboard() {
  return fetchFromStrapi<LeaderboardData>('/student/leaderboard');
}

