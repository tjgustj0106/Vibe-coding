export type TaskStatus = "todo" | "done";

export type Task = {
  id: string;
  title: string;
  detail?: string;
  subject?: string;
  dueDate?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};
