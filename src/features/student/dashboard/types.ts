export interface ChapterBadgeLogo {
  url: string | null;
}

export interface ChapterBadge {
  logo: ChapterBadgeLogo | null;
  name: string;
}

export interface Chapter {
  id: number;
  documentId: string;
  name: string;
  chapterNumber: number;
  description?: string | null;
  badge?: ChapterBadge | null;
  totalSendos?: number;
  onlineEstimatedTime?: number;
  inClassEstimatedTime?: number;
  sendosDescription?: string | null;
}

export interface QuizAnswer {
  id: number;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface QuizQuestion {
  id: number;
  questionText: string;
  answers: QuizAnswer[];
}

export interface Activity {
  id: number;
  documentId: string;
  title: string;
  type: "standard" | "team" | "homework";
  standardActivityType?: "video" | "quiz" | "recap" | "plot_auction";
  teamActivityType?: "join_team";
  order: number;
  sendosReward: number;
  completed: boolean;
  quizQuestions?: QuizQuestion[];
  thumbnail?: { url: string } | null;
  description?: string | null;
  guideline?: string | null;
  duration?: number | null;
  recapHeader?: string | null;
}

export interface ChapterWithActivities extends Chapter {
  activities: Activity[];
}

export interface DashboardData {
  totalSendos: number;
  currentChapter: Chapter | null;
  nextActivity: Activity | null;
  nextActivityAfter: Activity | null;
  isChapterComplete: boolean;
  isNextChapterLocked: boolean;
  nextChapterDetails: Chapter | null;
  nextChapterLockMessage: string | null;
  nextChapterLockReasons: ("teacher_pending" | "team_incomplete")[];
  isFirstActivityOfChapter: boolean;
  allChapters: ChapterWithActivities[];
}
