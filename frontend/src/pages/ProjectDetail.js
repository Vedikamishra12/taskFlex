import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, CheckCircle2, CircleDot, Users } from "lucide-react";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import GlassCard from "../components/ui/GlassCard";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../lib/initials";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { request } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [projectData, taskData] = await Promise.all([request("/api/projects"), request("/api/tasks")]);
      setProjects(projectData);
      setTasks(taskData);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    load();
  }, [load]);

  const project = useMemo(() => projects.find((p) => p._id === id), [projects, id]);

  const projectTasks = useMemo(
    () => tasks.filter((t) => t.project?._id === id || t.project === id),
    [tasks, id]
  );

  const stats = useMemo(() => {
    const total = projectTasks.length;
    const done = projectTasks.filter((t) => t.status === "Done").length;
    const overdue = projectTasks.filter((t) => t.status === "Overdue").length;
    const inProgress = projectTasks.filter((t) => t.status === "In Progress").length;
    return { total, done, overdue, inProgress, progress: total ? Math.round((done / total) * 100) : 0 };
  }, [projectTasks]);

  const timeline = useMemo(() => {
    return [...projectTasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 8);
  }, [projectTasks]);

  if (loading) return <LoadingState label="Loading project…" />;

  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        message="It may have been removed or you may not have access."
        icon={CircleDot}
      />
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <section className="relative mb-8 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-violet-900/30 to-cyan-900/20 p-4 shadow-2xl backdrop-blur-xl sm:mb-10 sm:rounded-3xl sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-200/90">Project</p>
            <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">{project.name}</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300/90">{project.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/tasks" className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10">
                View tasks
              </Link>
              <Link to="/projects" className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10">
                All projects
              </Link>
            </div>
          </div>
          <div className="w-full max-w-xs rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Completion</p>
            <p className="mt-1 text-3xl font-extrabold text-cyan-300 sm:text-4xl">{stats.progress}%</p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]"
                initial={{ width: 0 }}
                animate={{ width: `${stats.progress}%` }}
                transition={{ duration: 0.7 }}
              />
            </div>
          </div>
        </div>
      </section>

      <PageHeader eyebrow="Insight" title="Project overview" description="Team, throughput, and upcoming dates in one glance." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total tasks", value: stats.total, icon: CircleDot },
          { label: "Done", value: stats.done, icon: CheckCircle2 },
          { label: "In progress", value: stats.inProgress, icon: Users },
          { label: "Overdue", value: stats.overdue, icon: Calendar }
        ].map((s) => (
          <GlassCard key={s.label} hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{s.label}</p>
                <p className="mt-2 text-3xl font-extrabold text-white">{s.value}</p>
              </div>
              <s.icon className="h-6 w-6 text-violet-300/90" />
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-cyan-300" />
            <h3 className="text-sm font-bold text-white">Team</h3>
          </div>
          <p className="text-xs text-slate-500">Members on this project</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {project.members?.length ? (
              project.members.map((m) => (
                <div key={m._id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] text-xs font-bold text-white">
                    {getInitials(m.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{m.name}</p>
                    <p className="truncate text-xs text-slate-400">{m.email}</p>
                    <span className="mt-1 inline-block rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-200">
                      {m.role}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No members yet.</p>
            )}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-violet-300" />
            <h3 className="text-sm font-bold text-white">Timeline</h3>
          </div>
          <p className="text-xs text-slate-500">Upcoming due dates</p>
          <ul className="mt-4 space-y-3">
            {timeline.length === 0 && <li className="text-sm text-slate-500">No scheduled tasks.</li>}
            {timeline.map((t) => (
              <li key={t._id} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
                <p className="text-sm font-semibold text-white">{t.title}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge value={t.status} />
                  <span className="text-xs text-slate-400">{new Date(t.dueDate).toLocaleDateString()}</span>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </>
  );
};

export default ProjectDetail;
