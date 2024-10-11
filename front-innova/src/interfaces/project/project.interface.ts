import { User } from "../user/user.interface";

export interface Project {
  id?: string;
  name: string;
  description: string;
  initial_date: string;
  final_date: string;
  userId: number;
  user?: User;
}