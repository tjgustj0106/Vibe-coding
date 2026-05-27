const COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-green-100 text-green-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-teal-100 text-teal-700",
];

function colorIndex(subject: string) {
  let hash = 0;
  for (const c of subject) hash = (hash * 31 + c.charCodeAt(0)) % COLORS.length;
  return hash;
}

export default function SubjectBadge({ subject }: { subject: string }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-[11px] ${COLORS[colorIndex(subject)]}`}>
      {subject}
    </span>
  );
}
