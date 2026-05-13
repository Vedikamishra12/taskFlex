import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { CalendarClock, CheckCircle2, CircleDot, Flame, TrendingUp } from "lucide-react";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import GlassCard from "../components/ui/GlassCard";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";

const COLORS = {
  Todo: "#64748b",
  "In Progress": "#38bdf8",
  Done: "#34d399",
  Overdue: "#f87171"
};

const StatCard = ({ label, value, sub, icon: Icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35 }}
  >
    <GlassCard hover className="relative overflow-hidden p-6">
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/10 blur-2xl" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-2 text-4xl font-extrabold tabular-nums text-white">{value}</p>
          {sub && <p className="mt-2 text-xs text-slate-400">{sub}</p>}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-violet-200">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </GlassCard>
  </motion.div>
);

const Dashboard = () => {
  const { request, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({ status: "", priority: "", project: "" });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => value && params.append(key, value));
      const [taskData, projectData] = await Promise.all([
        request(`/api/tasks${params.toString() ? `?${params}` : ""}`),
        request("/api/projects")
      ]);
      setTasks(taskData);
      setProjects(projectData);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [filters, request]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = useMemo(
    () => ({
      total: tasks.length,
      completed: tasks.filter((t) => t.status === "Done").length,
      inProgress: tasks.filter((t) => t.status === "In Progress").length,
      overdue: tasks.filter((t) => t.status === "Overdue").length
    }),
    [tasks]
  );

  const statusPieData = useMemo(() => {
    const keys = ["Todo", "In Progress", "Done", "Overdue"];
    return keys.map((name) => ({
      name,
      value: tasks.filter((t) => t.status === name).length
    }));
  }, [tasks]);

  const projectBarData = useMemo(() => {
    return projects.map((p) => ({
      name: p.name.length > 14 ? `${p.name.slice(0, 12)}…` : p.name,
      full: p.name,
      tasks: tasks.filter((t) => t.project?._id === p._id || t.project === p._id).length
    }));
  }, [projects, tasks]);

  const teamPerformance = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      const id = t.assignedTo?._id || t.assignedTo;
      if (!id) return;
      if (!map[id]) map[id] = { name: t.assignedTo?.name || "Member", done: 0, total: 0 };
      map[id].total += 1;
      if (t.status === "Done") map[id].done += 1;
    });
    return Object.values(map)
      .map((row) => ({ ...row, rate: row.total ? Math.round((row.done / row.total) * 100) : 0 }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 6);
  }, [tasks]);

  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => new Date(b.createdAt || b.dueDate) - new Date(a.createdAt || a.dueDate))
      .slice(0, 6);
  }, [tasks]);

  const upcomingDeadlines = useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return [...tasks]
      .filter((t) => t.status !== "Done")
      .filter((t) => new Date(t.dueDate) >= startOfToday)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  }, [tasks]);

  const activity = useMemo(() => {
    return [...tasks]
      .filter((t) => t.createdAt)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8);
  }, [tasks]);

  if (loading) return <LoadingState label="Loading dashboard…" />;

  const chartTooltip = {
    contentStyle: {
      background: "rgba(15,23,42,0.95)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "12px",
      fontSize: "12px"
    },
    labelStyle: { color: "#e2e8f0" }
  };

  return (
    <>
      <section className="relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/30 via-slate-900/80 to-cyan-500/20 p-8 shadow-2xl shadow-violet-500/10 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:14px_14px]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-200/90">
              {user?.role === "admin" ? "Admin overview" : "My workspace"}
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Command your delivery pipeline</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300/90">
              Live analytics, deadlines, and team momentum — without leaving your flow.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300 backdrop-blur-md">
              <p className="font-semibold text-white">Projects active</p>
              <p className="mt-1 text-2xl font-bold text-cyan-300">{projects.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300 backdrop-blur-md">
              <p className="font-semibold text-white">Completion</p>
              <p className="mt-1 text-2xl font-bold text-emerald-300">
                {stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </section>

      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Track throughput, risk, and ownership from a single premium surface."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total tasks" value={stats.total} sub="Across visible work" icon={CircleDot} delay={0} />
        <StatCard label="Completed" value={stats.completed} sub="Marked done" icon={CheckCircle2} delay={0.05} />
        <StatCard label="In progress" value={stats.inProgress} sub="Active focus" icon={TrendingUp} delay={0.1} />
        <StatCard label="Overdue" value={stats.overdue} sub="Needs attention" icon={Flame} delay={0.15} />
      </div>

      <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-inner shadow-black/20 backdrop-blur-xl sm:p-5">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Filters</p>
        <div className="grid gap-3 md:grid-cols-3">
          <select className="form-input" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option className="bg-slate-900 text-slate-200" value="">All status</option>
            <option className="bg-slate-900 text-slate-200">Todo</option>
            <option className="bg-slate-900 text-slate-200">In Progress</option>
            <option className="bg-slate-900 text-slate-200">Done</option>
            <option className="bg-slate-900 text-slate-200">Overdue</option>
          </select>
          <select className="form-input" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
            <option className="bg-slate-900 text-slate-200" value="">All priorities</option>
            <option className="bg-slate-900 text-slate-200">Low</option>
            <option className="bg-slate-900 text-slate-200">Medium</option>
            <option className="bg-slate-900 text-slate-200">High</option>
          </select>
          <select className="form-input" value={filters.project} onChange={(e) => setFilters({ ...filters, project: e.target.value })}>
            <option className="bg-slate-900 text-slate-200" value="">All projects</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <GlassCard>
          <h3 className="text-sm font-bold text-white">Status distribution</h3>
          <p className="text-xs text-slate-500">Share of work by lifecycle state</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie nameKey="name" dataKey="value" data={statusPieData} innerRadius={56} outerRadius={88} paddingAngle={4}>
                  {statusPieData.map((entry) => (
                    <Cell key={entry.name} fill={COLORS[entry.name] || "#64748b"} stroke="rgba(15,23,42,0.8)" strokeWidth={1} />
                  ))}
                </Pie>
                <Tooltip {...chartTooltip} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm font-bold text-white">Tasks per project</h3>
          <p className="text-xs text-slate-500">Volume by portfolio</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  {...chartTooltip}
                  formatter={(v) => [v, "Tasks"]}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.full || ""}
                />
                <Bar dataKey="tasks" radius={[10, 10, 0, 0]}>
                  {projectBarData.map((_, i) => (
                    <Cell key={i} fill={`hsl(${250 + i * 18}, 75%, ${58 - i * 3}%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">Team performance</h3>
              <p className="text-xs text-slate-500">Done vs assigned (visible tasks)</p>
            </div>
          </div>
          <div className="mt-4 h-64">
            {teamPerformance.length === 0 ? (
              <p className="text-sm text-slate-500">No assignee data for the current filters.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamPerformance} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fill: "#cbd5e1", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    {...chartTooltip}
                    formatter={(value, _n, props) => [`${value}% (${props.payload.done}/${props.payload.total} done)`, "Completion"]}
                  />
                  <Bar dataKey="rate" fill="url(#barGrad)" radius={[0, 8, 8, 0]} />
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="var(--accent-from)" />
                      <stop offset="100%" stopColor="var(--accent-to)" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-cyan-300" />
            <div>
              <h3 className="text-sm font-bold text-white">Upcoming deadlines</h3>
              <p className="text-xs text-slate-500">Next due dates</p>
            </div>
          </div>
          <ul className="mt-4 space-y-3">
            {upcomingDeadlines.length === 0 && <li className="text-sm text-slate-500">No upcoming deadlines.</li>}
            {upcomingDeadlines.map((t) => (
              <li key={t._id} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
                <p className="text-sm font-semibold text-white">{t.title}</p>
                <p className="text-xs text-slate-400">
                  {t.project?.name} · {new Date(t.dueDate).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <h3 className="text-sm font-bold text-white">Recent tasks</h3>
          <p className="text-xs text-slate-500">Latest items in your view</p>
          <div className="mt-4 space-y-3">
            {recentTasks.length === 0 ? (
              <EmptyState title="No tasks" message="Tasks matching filters will appear here." />
            ) : (
              recentTasks.map((t) => (
                <div key={t._id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <p className="font-semibold text-white">{t.title}</p>
                    <p className="text-xs text-slate-400">{t.project?.name}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge value={t.status} />
                    <Badge type="priority" value={t.priority} />
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm font-bold text-white">Activity</h3>
          <p className="text-xs text-slate-500">Recently created tasks</p>
          <ul className="mt-4 space-y-3">
            {activity.length === 0 && <li className="text-sm text-slate-500">No recent activity.</li>}
            {activity.map((t) => (
              <li key={t._id} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 shadow-glow" />
                <div>
                  <p className="text-sm text-slate-200">
                    New task <span className="font-semibold text-white">{t.title}</span>
                  </p>
                  <p className="text-xs text-slate-500">{new Date(t.createdAt).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <section className="mt-8">
        {tasks.length === 0 ? (
          <EmptyState title="No tasks found" message="Tasks matching the selected filters will appear in the table below." />
        ) : (
          <GlassCard className="p-0 overflow-hidden">
            <div className="border-b border-white/10 px-5 py-4">
              <h3 className="text-sm font-bold text-white">Task register</h3>
              <p className="text-xs text-slate-500">Scroll horizontally on smaller screens</p>
            </div>
            <div className="scrollbar-thin overflow-x-auto">
              <table className="min-w-[720px] w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3">Task</th>
                    <th className="px-5 py-3">Project</th>
                    <th className="px-5 py-3">Assignee</th>
                    <th className="px-5 py-3">Priority</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {tasks.map((task) => (
                    <tr key={task._id} className={task.status === "Overdue" ? "bg-red-500/5" : "hover:bg-white/[0.03]"}>
                      <td className="px-5 py-3 font-semibold text-white">{task.title}</td>
                      <td className="px-5 py-3 text-slate-400">{task.project?.name}</td>
                      <td className="px-5 py-3 text-slate-400">{task.assignedTo?.name}</td>
                      <td className="px-5 py-3">
                        <Badge type="priority" value={task.priority} />
                      </td>
                      <td className="px-5 py-3">
                        <Badge value={task.status} />
                      </td>
                      <td className="px-5 py-3 text-slate-400">{new Date(task.dueDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}
      </section>
    </>
  );
};

export default Dashboard;
