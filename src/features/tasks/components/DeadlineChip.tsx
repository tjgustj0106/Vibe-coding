export default function DeadlineChip({ dueDate }: { dueDate: string }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diff = Math.round((due.getTime() - today.getTime()) / 86400000);

  let label = "";
  let style = "bg-[#f5f5f7] text-[#6e6e73]";

  if (diff < 0) { label = "기한 초과"; style = "bg-red-50 text-red-500"; }
  else if (diff === 0) { label = "오늘 마감"; style = "bg-red-50 text-red-500"; }
  else if (diff === 1) { label = "내일 마감"; style = "bg-orange-50 text-orange-500"; }
  else { label = `D-${diff}`; }

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${style}`}>
      {label}
    </span>
  );
}
