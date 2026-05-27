import { Task } from "./types";

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "선형대수 과제 제출",
    detail: "교재 p.120~135 연습문제 풀이 후 LMS 제출",
    subject: "선형대수",
    dueDate: "2026-05-30",
    status: "todo",
    createdAt: "2026-05-27T09:00:00.000Z",
    updatedAt: "2026-05-27T09:00:00.000Z",
  },
  {
    id: "2",
    title: "알고리즘 문제풀이",
    detail: "백준 1932번, 1149번 풀기",
    subject: "알고리즘",
    dueDate: "2026-05-28",
    status: "todo",
    createdAt: "2026-05-27T09:00:00.000Z",
    updatedAt: "2026-05-27T09:00:00.000Z",
  },
  {
    id: "3",
    title: "독서 30분",
    detail: "",
    status: "done",
    createdAt: "2026-05-27T08:00:00.000Z",
    updatedAt: "2026-05-27T10:00:00.000Z",
  },
];
