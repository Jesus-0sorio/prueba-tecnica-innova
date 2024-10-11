import { User } from "@/interfaces/user/user.interface";
import { Project } from "../project/project.interface";

export interface Task {
  id?: number;
  name: string;
  description: string;
  status: string;
  userId?: number;
  projectId?: number;
  project?: Project;
  user?: User;
}

export type TaskServiceProps = {
  token: string;
};