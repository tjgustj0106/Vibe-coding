"use client";

import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import DayNavigator from "@/features/tasks/components/DayNavigator";
import TaskList from "@/features/tasks/components/TaskList";
import TaskForm from "@/features/tasks/components/TaskForm";
import CalendarGrid from "@/features/tasks/components/CalendarGrid";
import ScheduleTimeline from "@/features/schedule/components/ScheduleTimeline";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useScheduleEvents } from "@/features/schedule/hooks/useScheduleEvents";
import { getTodayString } from "@/features/tasks/utils";
import { Task } from "@/features/tasks/types";

type View = "daily" | "monthly";
type FormMode = "create" | "edit" | "detail";

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function AppPage() {
  const [currentView, setCurrentView] = useState<View>("daily");
  const [selectedDate, setSelectedDate] = useState(getTodayString());

  // Form / modal UI 상태
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [modalTask, setModalTask] = useState<Task | null>(null);

  // 도메인 훅
  const tasks = useTasks(selectedDate);
  const schedule = useScheduleEvents(selectedDate);

  // --- Task form handlers ---
  function handleOpenCreate() {
    setModalTask(null);
    setFormMode("create");
    setShowForm(true);
  }

  function handleClickDetail(task: Task) {
    setModalTask(task);
    setFormMode("detail");
    setShowForm(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setModalTask(null);
  }

  function handleFormSubmit(input: Omit<Task, "id" | "createdAt" | "updatedAt">) {
    if (formMode === "create") {
      tasks.add(input);
    } else if (formMode === "edit" && modalTask) {
      tasks.editSubmit(input, modalTask);
    }
    handleCloseForm();
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
                할 일 {tasks.dailyTasks.filter((t) => t.status === "todo").length}개 남음
              </h2>
              <button
                onClick={handleOpenCreate}
                data-testid="open-task-form"
                className="bg-[#0066cc] text-white text-sm px-4 py-2 rounded-full
                           transition-transform active:scale-95 hover:bg-[#0055b3]"
              >
                + 할 일 추가
              </button>
            </div>
            <ScheduleTimeline
              date={selectedDate}
              events={schedule.dailyEvents}
              onAdd={schedule.add}
              onUpdate={schedule.update}
              onDelete={schedule.remove}
            />
            <TaskList
              tasks={tasks.dailyTasks}
              filter={tasks.filter}
              onFilterChange={tasks.setFilter}
              onToggle={tasks.toggle}
              onClickDetail={handleClickDetail}
              onAdd={handleOpenCreate}
              selectedDate={selectedDate}
            />
          </>
        ) : (
          <CalendarGrid
            tasks={tasks.tasks}
            events={schedule.events}
            today={getTodayString()}
            selectedDate={selectedDate}
            onDateClick={(date) => {
              setSelectedDate(date);
              setCurrentView("daily");
            }}
          />
        )}
      </main>

      {showForm && (
        <TaskForm
          mode={formMode}
          task={modalTask ?? undefined}
          onSubmit={handleFormSubmit}
          onDelete={tasks.remove}
          onClose={handleCloseForm}
          onEditMode={() => setFormMode("edit")}
        />
      )}
    </div>
  );
}
