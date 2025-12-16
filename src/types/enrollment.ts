import { User } from "./user";

export interface Class {
  id: number;
  name?: string;
}

export interface Enrollment {
  id: number;
  student: User;
  class?: Class;
}
