type View = "daily" | "monthly";

type AppHeaderProps = {
  currentView: View;
  onViewChange: (view: View) => void;
  onOpenCoachSettings?: () => void;
  coachName?: string;
};

export default function AppHeader({ currentView, onViewChange, onOpenCoachSettings, coachName }: AppHeaderProps) {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <header className="bg-white border-b border-[#e0e0e0] px-6 py-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[#1d1d1f] tracking-tight">
            StudyLog
          </h1>
          <div className="flex items-center gap-3">
            {onOpenCoachSettings && (
              <button
                onClick={onOpenCoachSettings}
                title={coachName ? `${coachName} 설정` : "캐릭터 설정"}
                className="flex items-center gap-1.5 text-sm text-[#6e6e73] border border-[#d1d1d6]
                           px-3 py-1.5 rounded-full hover:border-[#0066cc] hover:text-[#0066cc]
                           hover:bg-[#f0f6ff] transition-colors"
              >
                {coachName ? (
                  <><span>🙂</span><span>{coachName}</span><span className="text-[#aeaeb2]">⚙︎</span></>
                ) : (
                  <><span>⚙︎</span><span>캐릭터 설정</span></>
                )}
              </button>
            )}
            <span className="text-sm text-[#6e6e73]">{today}</span>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onViewChange("daily")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              currentView === "daily"
                ? "bg-[#0066cc] text-white"
                : "text-[#6e6e73] hover:text-[#1d1d1f]"
            }`}
          >
            하루 뷰
          </button>
          <button
            onClick={() => onViewChange("monthly")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              currentView === "monthly"
                ? "bg-[#0066cc] text-white"
                : "text-[#6e6e73] hover:text-[#1d1d1f]"
            }`}
          >
            월간 뷰
          </button>
        </div>
      </div>
    </header>
  );
}
