"use client";

import { useState, useEffect, useMemo } from "react";
import AppHeader from "@/components/layout/AppHeader";
import DayNavigator from "@/features/tasks/components/DayNavigator";
import TaskList from "@/features/tasks/components/TaskList";
import TaskForm from "@/features/tasks/components/TaskForm";
import { mockTasks } from "@/features/tasks/mock-data";
import { getTasks, saveTasks } from "@/features/tasks/storage";
import { getTodayString, getTasksForDate } from "@/features/tasks/utils";
import { Task, TaskStatus } from "@/features/tasks/types";

type View = "daily" | "monthly";
type Filter = TaskStatus | "all";
type FormMode = "create" | "edit" | "detail";

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function AppPage() {
  const [currentView, setCurrentView] = useState<View>("daily");
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = getTasks();
    return saved.length > 0 ? saved : mockTasks;
  });
  const [filter, setFilter] = useState<Filter>("all");
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [modalTask, setModalTask] = useState<Task | null>(null);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const dailyTasks = useMemo(
    () => getTasksForDate(tasks, selectedDate),
    [tasks, selectedDate]
  );

  function handleAdd(input: Omit<Task, "id" | "createdAt" | "updatedAt">) {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [newTask, ...prev]);
  }

  function handleUpdate(updated: Task) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === updated.id
          ? { ...updated, updatedAt: new Date().toISOString() }
          : t
      )
    );
  }

  function handleDelete(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function handleToggle(id: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "done" ? "todo" : "done", updatedAt: new Date().toISOString() }
          : t
      )
    );
  }

  function handleClickDetail(task: Task) {
    setModalTask(task);
    setFormMode("detail");
    setShowForm(true);
  }

  function handleOpenCreate() {
    setModalTask(null);
    setFormMode("create");
    setShowForm(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setModalTask(null);
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      <AppHeader currentView={currentView} onViewChange={setCurrentView} />

      {currentView === "daily" && (
        <DayNavigator
          selectedDate={selectedDate}
          onPrev={() => setSelectedDate(addDays(selectedDate, -1))}
          onToday={() => setSelectedDate(getTodayString())}
          onNext={() => setSelectedDate(addDays(selectedDate, 1))}
        />
      )}

      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-6">
        {currentView === "daily" ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-[#6e6e73]">
                할 일 {dailyTasks.filter((t) => t.status === "todo").length}개 남음
              </h2>
              <button
                onClick={handleOpenCreate}
                className="bg-[#0066cc] text-white text-sm px-4 py-2 rounded-full
                           transition-transform active:scale-95 hover:bg-[#0055b3]"
              >
                + 추가
              </button>
            </div>
            <TaskList
              tasks={dailyTasks}
              filter={filter}
              onFilterChange={setFilter}
              onToggle={handleToggle}
              onClickDetail={handleClickDetail}
              onAdd={handleOpenCreate}
            />
          </>
        ) : (
          <div className="bg-white rounded-[18px] p-6 text-center text-[#6e6e73]">
            <p className="text-[17px]">🗓️ 월간 달력</p>
            <p className="text-sm mt-1">3회차에서 구현합니다</p>
          </div>
        )}
      </main>

      {showForm && (
        <TaskForm
          mode={formMode}
          task={modalTask ?? undefined}
          onSubmit={
            formMode === "create"
              ? handleAdd
              : (input) =>
                  handleUpdate({
                    ...input,
                    id: modalTask!.id,
                    createdAt: modalTask!.createdAt,
                    updatedAt: new Date().toISOString(),
                  })
          }
          onDelete={handleDelete}
          onClose={handleCloseForm}
          onEditMode={() => setFormMode("edit")}
        />
      )}
    </div>
  );
}
