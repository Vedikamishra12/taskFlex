import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Mail, Shield, Sparkles, User } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../lib/initials";

const Team = () => {
  const { request } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, t] = await Promise.all([request("/api/projects"), request("/api/tasks")]);
      setProjects(p);
      setTasks(t);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    load();
  }, [load]);

  const members = useMemo(() => {
    const map = new Map();
    projects.forEach((project) => {
      project.members?.forEach((m) => {
        if (!map.has(m._id)) {
          map.set(m._id, { ...m, projects: [] });
        }
        map.get(m._id).projects.push(project.name);
      });
    });
    return Array.from(map.values());
  }, [projects]);

  const activityHint = useMemo(() => {
    return members.map((m) => {
      const active = tasks.filter((t) => (t.assignedTo?._id || t.assignedTo) === m._id && t.status !== "Done").length;
      return { id: m._id, active };
    });
  }, [members, tasks]);

  const activeMap = useMemo(() => Object.fromEntries(activityHint.map((a) => [a.id, a.active])), [activityHint]);

  if (loading) return <LoadingState label="Loading team…" />;

  return (
    <>
      <PageHeader
        eyebrow="People"
        title="Team members"
        description="Everyone you collaborate with across visible projects."
      />

      {members.length === 0 ? (
        <GlassCard className="text-center text-slate-400">No team members yet. Add people to a project first.</GlassCard>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {members.map((m, i) => (
            <motion.div key={m._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <GlassCard hover className="relative overflow-hidden">
                <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-violet-500/25 to-cyan-500/10 blur-2xl" />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] text-base font-extrabold text-white shadow-lg">
                    {getInitials(m.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-lg font-bold text-white">{m.name}</h3>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-200 ring-1 ring-white/10">
                        {m.role === "admin" ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                        {m.role}
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-2 truncate text-sm text-slate-400">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      {m.email}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${
                          activeMap[m._id] > 0
                            ? "bg-cyan-500/15 text-cyan-200 ring-cyan-400/30"
                            : "bg-emerald-500/15 text-emerald-200 ring-emerald-400/25"
                        }`}
                      >
                        <Sparkles className="h-3 w-3" />
                        {activeMap[m._id] > 0 ? `${activeMap[m._id]} active tasks` : "Clear runway"}
                      </span>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-slate-500">
                      Projects: {m.projects.slice(0, 3).join(", ")}
                      {m.projects.length > 3 ? ` +${m.projects.length - 3}` : ""}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
};

export default Team;
