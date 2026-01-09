import { User } from "./user";

export interface Class {
  id: number;
  name?: string;
}

export interface SelectedPlot {
  id: string;
  documentId: string;
  plotCode: string;
  title: string;
  description: string;
  startingBid: number;
}

export interface Enrollment {
  id: number;
  student: User;
  class?: Class;
  selectedPlot?: SelectedPlot | null;
}
