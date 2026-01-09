import type { QuizQuestion } from "@/features/student/dashboard/types";

export type ActivityStub = {
  id: string;
  documentId: string;
  type: "team" | "standard" | "homework";
  standardActivityType?: "video" | "quiz" | "reading" | "problem_statement" | "recap" | "plot_auction";
  teamActivityType?: "join_team" | "rename_team" | "upload_idea";
  teamActivityKey: string;
  title: string;
  order: number;
  sendosReward?: number;
  videoUrl?: string;
  duration?: number;
  description?: string;
  guideline?: string;
  recapHeader?: string;
  quizQuestions?: QuizQuestion[];
  plots?: PlotOption[];
};

export type PlotOption = {
  id: string;
  documentId: string;
  plotCode: string;
  title: string;
  description: string;
  startingBid: number;
};

export type ProgressStub = {
  id: string;
  activityStatus: "completed" | "in_progress" | "pending";
  activity: {
    id: string;
  };
};

export type TeamOption = {
  id: string;
  documentId: string;
  name: string;
  cheer?: string | null;
  idea?: string | null;
  enrollments: {
    student: {
      id: number;
      username: string;
    };
  }[];
  isLocked: boolean;
};

export type TeamRenameCompletionPayload = {
  name: string;
  cheer: string;
};

export type TeamIdeaCompletionPayload = {
  idea: string;
};

export type ProblemStatementCompletionPayload = {
  who: string;
  what: string;
  why: string;
};

export type TeamJoinCompletionPayload = {
  activityKey: string;
  studentId: number;
  currentTeamId: string | null;
  newTeamId: string;
  isLocked: boolean;
};

export type PlotAuctionCompletionPayload = {
  plotId: string;
  bidAmount: number;
};
