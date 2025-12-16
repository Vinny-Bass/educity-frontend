import {
  ProblemStatementCompletionPayload,
  TeamIdeaCompletionPayload,
  TeamJoinCompletionPayload,
  TeamRenameCompletionPayload,
} from "@/features/student/activity/types";
import { create } from "zustand";

type ActivityCompletionData =
  | TeamJoinCompletionPayload
  | TeamRenameCompletionPayload
  | TeamIdeaCompletionPayload
  | ProblemStatementCompletionPayload;

interface ActivityCompletionPayload {
  type: string;
  data?: ActivityCompletionData | null;
}

interface ActivityState {
  isCurrentActivityCompleted: boolean;
  completionPayload: ActivityCompletionPayload | null;
  setIsCurrentActivityCompleted: (isCompleted: boolean) => void;
  setCompletionPayload: (payload: ActivityCompletionPayload | null) => void;
  resetCompletion: () => void;
}

/**
 * Manages the completion state of the *current* activity.
 * This allows the VideoPlayer (or Quiz) to communicate
 * with the BottomBar to enable the 'Next' button.
 */
export const useActivityStore = create<ActivityState>((set) => ({
  isCurrentActivityCompleted: false,
  completionPayload: null,
  setIsCurrentActivityCompleted: (isCompleted) =>
    set({ isCurrentActivityCompleted: isCompleted }),
  setCompletionPayload: (payload) => set({ completionPayload: payload }),

  resetCompletion: () =>
    set({ isCurrentActivityCompleted: false, completionPayload: null }),
}));
