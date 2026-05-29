"use client";

import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import DayNavigator from "@/features/tasks/components/DayNavigator";
import TaskList from "@/features/tasks/components/TaskList";
import TaskForm from "@/features/tasks/components/TaskForm";
import CalendarGrid from "@/features/tasks/components/CalendarGrid";
import ScheduleTimeline from "@/features/schedule/components/ScheduleTimeline";
import CoachOnboarding from "@/features/coach/components/CoachOnboarding";
import CoachBubble from "@/features/coach/components/CoachBubble";
import CoachCompletionPop from "@/features/coach/components/CoachCompletionPop";
import CoachWeeklySummary from "@/features/coach/components/CoachWeeklySummary";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useScheduleEvents } from "@/features/schedule/hooks/useScheduleEvents";
import { useCoach } from "@/features/coach/hooks/useCoach";
import { getTodayString } from "@/features/tasks/utils";
import { Task } from "@/features/tasks/types";
import { CoachProfile, CoachSituation } from "@/features/coach/types";

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
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Coach completion pop 상태
  const [completionPopText, setCompletionPopText] = useState<string | null>(null);
  const [completionCount, setCompletionCount] = useState(0); // 세션 내 완료 팝업 표시 횟수

  // Coach 설정 모달 상태
  const [showCoachSettings, setShowCoachSettings] = useState(false);

  // 도메인 훅
  const tasks = useTasks(selectedDate);
  const schedule = useScheduleEvents(selectedDate);
  const coach = useCoach();

  // coach hydration 완료 후 프로필 없으면 온보딩 표시
  // showOnboarding=true는 사용자가 "건너뛰기"를 누른 경우 (이 세션에서는 다시 표시 안 함)
  const isOnboarding = coach.hydrated && coach.profile === null && !showOnboarding;

  function handleOnboardingComplete(profile: CoachProfile) {
    coach.saveProfile(profile);
  }

  function handleOnboardingSkip() {
    // 건너뛰기: 이 세션에서는 온보딩 다시 표시 안 함
    setShowOnboarding(true);
  }

  // --- Coach nag bubble logic ---
  function getNagSituation(): { situation: CoachSituation; task: Task } | null {
    if (!coach.profile) return null;
    const today = getTodayString();
    const urgentTasks = tasks.dailyTasks
      .filter((t) => t.status === "todo" && t.dueDate)
      .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1));
    if (!urgentTasks.length) return null;
    const t = urgentTasks[0];
    const diff = Math.floor(
      (new Date(t.dueDate!).getTime() - new Date(today).getTime()) / 86400000
    );
    let situation: CoachSituation;
    if (diff < 0) situation = "overdue";
    else if (diff === 0) situation = "dday";
    else if (diff === 1) situation = "d1";
    else if (diff === 2) situation = "d2";
    else if (diff === 3) situation = "d3";
    else return null; // D-4 이상은 표시 안 함
    return { situation, task: t };
  }

  const nagInfo = getNagSituation();

  // --- Coach completion toggle handler ---
  async function handleToggle(id: string) {
    const task = tasks.dailyTasks.find((t) => t.id === id);
    const willComplete = task?.status === "todo";
    tasks.toggle(id);

    // 완료 전환 + coach 프로필 있음 + 쿨다운 미만
    if (willComplete && coach.profile && completionCount < 3) {
      setCompletionCount((c) => c + 1);
      const text = await coach.fetchDialogue("complete", task?.title);
      setCompletionPopText(text);
    }
  }

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

  // 온보딩 화면 표시 (coach profile 없을 때)
  if (isOnboarding) {
    return (
      <CoachOnboarding
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      <AppHeader
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenCoachSettings={() => setShowCoachSettings(true)}
        coachName={coach.profile?.name}
      />

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
            {/* Coach nag bubble */}
            {coach.profile && nagInfo && (
              <CoachBubble
                profile={coach.profile}
                situation={nagInfo.situation}
                taskTitle={nagInfo.task.title}
                fetchDialogue={coach.fetchDialogue}
              />
            )}
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
              onToggle={handleToggle}
              onClickDetail={handleClickDetail}
              onAdd={handleOpenCreate}
              selectedDate={selectedDate}
            />
            {/* Coach weekly summary */}
            {coach.profile && (
              <CoachWeeklySummary
                profile={coach.profile}
                tasks={tasks.tasks}
                fetchDialogue={coach.fetchDialogue}
              />
            )}
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
            onAddEvent={schedule.add}
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

      {/* Coach completion praise popup */}
      {completionPopText && coach.profile && (
        <CoachCompletionPop
          profile={coach.profile}
          text={completionPopText}
          onDone={() => setCompletionPopText(null)}
        />
      )}

      {/* Coach 설정 모달 (수정 모드) */}
      {showCoachSettings && (
        <CoachOnboarding
          initialProfile={coach.profile ?? undefined}
          onComplete={(profile) => {
            coach.saveProfile(profile);
            setShowCoachSettings(false);
          }}
          onSkip={() => setShowCoachSettings(false)}
        />
      )}
    </div>
  );
}
