import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex flex-col font-[family-name:var(--font-inter)]">

      {/* Hero */}
      <section className="bg-white flex flex-col items-center text-center px-6 py-24 gap-6">
        <p className="text-sm font-semibold text-[#0066cc] tracking-wide uppercase">
          StudyLog
        </p>
        <h1
          className="text-5xl font-semibold text-[#1d1d1f] leading-tight max-w-2xl"
          style={{ letterSpacing: "-0.28px" }}
        >
          오늘 해야 할 일,<br />한 번에 보이게
        </h1>
        <p className="text-xl text-[#6e6e73] max-w-xl leading-relaxed">
          과제 마감일을 한 번만 입력하면<br />
          마감일까지 매일 자동으로 할 일에 나타납니다
        </p>
        <Link
          href="/app"
          className="mt-2 bg-[#0066cc] text-white text-lg px-8 py-3 rounded-full
                     transition-transform active:scale-95 hover:bg-[#0055b3]"
        >
          플래너 시작하기
        </Link>
      </section>

      {/* Problem */}
      <section className="bg-[#f5f5f7] px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl font-semibold text-[#1d1d1f] text-center mb-12"
            style={{ letterSpacing: "-0.374px" }}
          >
            이런 경험 있으신가요?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((p) => (
              <div key={p.title} className="bg-white rounded-[18px] p-6">
                <div className="text-3xl mb-4">{p.emoji}</div>
                <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">{p.title}</h3>
                <p className="text-[17px] text-[#6e6e73] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="bg-white px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl font-semibold text-[#1d1d1f] text-center mb-12"
            style={{ letterSpacing: "-0.374px" }}
          >
            StudyLog가 해결합니다
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="flex flex-col gap-3">
                <div className="text-3xl">{f.emoji}</div>
                <h3 className="text-lg font-semibold text-[#1d1d1f]">{f.title}</h3>
                <p className="text-[17px] text-[#6e6e73] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#f5f5f7] flex flex-col items-center text-center px-6 py-20 gap-6">
        <h2
          className="text-3xl font-semibold text-[#1d1d1f]"
          style={{ letterSpacing: "-0.374px" }}
        >
          지금 바로 시작해보세요
        </h2>
        <p className="text-[17px] text-[#6e6e73]">로그인 없이 바로 사용할 수 있습니다</p>
        <Link
          href="/app"
          className="bg-[#0066cc] text-white text-lg px-8 py-3 rounded-full
                     transition-transform active:scale-95 hover:bg-[#0055b3]"
        >
          플래너 시작하기
        </Link>
      </section>

    </main>
  );
}

const problems = [
  {
    emoji: "📚",
    title: "일정이 여기저기 흩어져요",
    desc: "강의, 과제, 시험, 개인 일정이 각각 다른 앱에 있어 빠뜨리는 경우가 많아요.",
  },
  {
    emoji: "😓",
    title: "매일 옮겨 적어야 해요",
    desc: "마감일을 알아도 매일 오늘 할 일 목록에 직접 옮겨 적어야 하는 번거로움이 있어요.",
  },
  {
    emoji: "🗑️",
    title: "결국 아무것도 안 쓰게 돼요",
    desc: "짧게 적으면 나중에 기억이 안 나고, 길게 적으면 너무 복잡해서 다시 안 보게 돼요.",
  },
];

const features = [
  {
    emoji: "✅",
    title: "하루 할 일 한눈에",
    desc: "오늘 해야 할 일이 자동으로 모입니다. 완료하면 체크 한 번으로 끝.",
  },
  {
    emoji: "📅",
    title: "과제 자동 반영",
    desc: "마감일을 한 번만 입력하면 마감 당일까지 매일 할 일에 자동으로 나타납니다.",
  },
  {
    emoji: "🗓️",
    title: "월간 달력으로 전체 파악",
    desc: "한 달 일정을 달력으로 한눈에 확인하고 날짜를 눌러 바로 이동할 수 있어요.",
  },
];
