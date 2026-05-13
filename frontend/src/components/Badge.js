const statusColors = {
  Todo: "bg-slate-500/20 text-slate-200 ring-slate-500/30",
  "In Progress": "bg-sky-500/20 text-sky-200 ring-sky-400/35",
  Done: "bg-emerald-500/20 text-emerald-200 ring-emerald-400/35",
  Overdue: "bg-red-500/25 text-red-100 ring-red-400/50 shadow-[0_0_20px_rgba(248,113,113,0.35)]"
};

const priorityColors = {
  Low: "bg-emerald-500/20 text-emerald-200 ring-emerald-400/35",
  Medium: "bg-amber-500/20 text-amber-100 ring-amber-400/40",
  High: "bg-red-500/25 text-red-100 ring-red-400/45"
};

const Badge = ({ type = "status", value }) => {
  const colorMap = type === "priority" ? priorityColors : statusColors;
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ${colorMap[value] || "bg-slate-500/20 text-slate-200 ring-slate-500/30"}`}
    >
      {value}
    </span>
  );
};

export default Badge;
