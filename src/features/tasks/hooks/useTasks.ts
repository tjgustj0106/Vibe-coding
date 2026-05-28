"use client";

import { useState, useEffect, useMemo } from "react";
import { Task, TaskStatus } from "../types";
import { saveTasks } from "../storage";
import { getTasksForDate } from "../utils";
import { mockTasks } from "../mock-data";

type Filter = TaskStatus | "all";

export function useTasks(selectedDate: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");

  // 클라이언트 마운트 후 localStorage 로드 (SSR hydration mismatch 방지)
  useEffect(() => {
    const raw = localStorage.getItem("studylog_tasks");
    if (raw === null) {
      setTasks(mockTasks); // 첫 방문 → mock data
    } else {
      try {
        setTasks(JSON.parse(raw) as Task[]);
      } catch {
        setTasks(mockTasks);
      }
    }
    setHydrated(true);
  }, []);

  // hydrate 완료 후에만 저장 (초기 빈 배열로 덮어쓰기 방지)
  useEffect(() => {
    if (!hydrated) return;
    saveTasks(tasks);
  }, [tasks, hydrated]);

  const dailyTasks = useMemo(
    () => getTasksForDate(tasks, selectedDate),
    [tasks, selectedDate]
  );

  function add(input: Omit<Task, "id" | "createdAt" | "updatedAt">) {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [newTask, ...prev]);
  }

  function update(updated: Task) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === updated.id
          ? { ...updated, updatedAt: new Date().toISOString() }
          : t
      )
    );
  }

  function editSubmit(
    input: Omit<Task, "id" | "createdAt" | "updatedAt">,
    original: Task
  ) {
    update({
      ...input,
      id: original.id,
      createdAt: original.createdAt,
      updatedAt: new Date().toISOString(),
    });
  }

  function remove(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function toggle(id: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "done" ? "todo" : "done",
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  }

  return { tasks, dailyTasks, filter, setFilter, add, update, editSubmit, remove, toggle };
}
