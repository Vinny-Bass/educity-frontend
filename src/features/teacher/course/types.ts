export interface Course {
  id: number;
  name: string;
  goal: string;
  essentialQuestions: string[] | null;
  ideasAndSkillsEarned: string[] | null;
  chapters: Chapter[];
  courseNumber: number;
}

export interface Chapter {
  id: number;
  name: string;
  thumbnail: string | null;
  chapterNumber?: number;
  completed?: boolean;
}
