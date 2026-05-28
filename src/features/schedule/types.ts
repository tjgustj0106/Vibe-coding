export type ScheduleEvent = {
  id: string;
  title: string;
  date: string;       // YYYY-MM-DD
  startTime: string;  // "HH:MM" 24시간제
  endTime: string;    // "HH:MM" 24시간제
  createdAt: string;
  updatedAt: string;
};
