import { TaskStatus } from "../types";

type Filter = TaskStatus | "all";

type FilterTabsProps = {
  current: Filter;
  onChange: (filter: Filter) => void;
};

const TABS: { label: string; value: Filter }[] = [
  { label: "전체", value: "all" },
  { label: "미완료", value: "todo" },
  { label: "완료", value: "done" },
];

export default function FilterTabs({ current, onChange }: FilterTabsProps) {
  return (
    <div className="flex gap-4 px-1" role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={current === tab.value}
          onClick={() => onChange(tab.value)}
          className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
            current === tab.value
              ? "border-[#0066cc] text-[#0066cc]"
              : "border-transparent text-[#6e6e73] hover:text-[#1d1d1f]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
