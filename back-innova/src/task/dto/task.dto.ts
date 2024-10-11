export interface TaskDto {
  id?: number;
  title: string;
  description: string;
  status: string;
  userId?: number;
  projectId?: number;
}
