export interface LeaderboardEntry {
  rank: number;
  id: number; // enrollment id
  student: {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
  };
  totalSendos: number;
}

export type LeaderboardData = LeaderboardEntry[];



