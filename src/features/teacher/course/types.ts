import { Class } from "../../../types/enrollment";

export interface Course {
  id: number;
  name: string;
  goal: string;
  essentialQuestions: string[] | null;
  ideasAndSkillsEarned: string[] | null;
  chapters: Chapter[];
  courseNumber: number;
  completed?: boolean;
  class: Class;
}

export interface Chapter {
  id: number;
  documentId: string;
  name: string;
  thumbnail: string | null;
  chapterNumber?: number;
  completed?: boolean;
}
