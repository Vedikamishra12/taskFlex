import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { FolderKanban, Plus, Search, Trash2, UserPlus } from "lucide-react";
import Button from "../components/ui/Button";
import EmptyState from "../components/EmptyState";
import GlassCard from "../components/ui/GlassCard";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";

const Projects = () => {
  const { isAdmin, request } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [memberEmails, setMemberEmails] = useState({});
  const [query, setQuery] = useState("");

  const fetchAll = useCallback(async () => {
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
    fetchAll();
  }, [fetchAll]);

  const progressByProject = useMemo(() => {
    const map = {};
    projects.forEach((p) => {
      const pts = tasks.filter((t) => t.project?._id === p._id || t.project === p._id);
      const done = pts.filter((t) => t.status === "Done").length;
      map[p._id] = pts.length ? Math.round((done / pts.length) * 100) : 0;
    });
    return map;
  }, [projects, tasks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }, [projects, query]);

  const createProject = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await request("/api/projects", { method: "POST", body: JSON.stringify(form) });
      setForm({ name: "", description: "" });
      toast.success("Project created");
      fetchAll();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const addMember = async (projectId) => {
    try {
      await request(`/api/projects/${projectId}/members`, {
        method: "POST",
        body: JSON.stringify({ email: memberEmails[projectId] })
      });
      setMemberEmails({ ...memberEmails, [projectId]: "" });
      toast.success("Member added");
      fetchAll();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await request(`/api/projects/${projectId}`, { method: "DELETE" });
      toast.success("Project deleted");
      fetchAll();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeMember = async (projectId, memberId) => {
    try {
      await request(`/api/projects/${projectId}/members/${memberId}`, { method: "DELETE" });
      toast.success("Member removed");
      fetchAll();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <LoadingState label="Loading projects…" skeleton />;

  return (
    <>
      <section className="relative mb-8 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900/90 via-indigo-900/40 to-cyan-900/30 p-4 shadow-2xl backdrop-blur-xl sm:mb-10 sm:rounded-3xl sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-200/90">Portfolio</p>
            <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">Projects that stay accountable</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300/90">
              Glass cards, live progress, and crisp member management — same APIs, elevated presentation.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <FolderKanban className="h-8 w-8 text-cyan-300" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Active</p>
              <p className="text-2xl font-bold text-white">{projects.length}</p>
            </div>
          </div>
        </div>
      </section>

      <PageHeader
        eyebrow="Spaces"
        title="Projects"
        description={isAdmin ? "Create project spaces and add member accounts by email." : "Browse the projects where you are a member."}
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            className="form-input pl-10"
            placeholder="Search by name or description…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {isAdmin && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={createProject}
          className="mb-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-inner shadow-black/30 backdrop-blur-xl sm:rounded-3xl sm:p-5"
        >
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
            <Plus className="h-4 w-4 text-violet-300" />
            New project
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_2fr_auto] lg:items-end">
            <input
              className="form-input min-w-0"
              placeholder="Project name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className="form-input min-w-0"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
            <Button type="submit" disabled={saving} className="w-full shrink-0 whitespace-nowrap sm:w-auto lg:w-auto">
              {saving ? "Creating…" : "Create"}
            </Button>
          </div>
        </motion.form>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title={projects.length === 0 ? "No projects yet" : "No matches"}
          message={
            projects.length === 0
              ? isAdmin
                ? "Create the first project to start assigning team work."
                : "Ask an admin to add you to a project."
              : "Try a different search query."
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
          {filtered.map((project, i) => {
            const pct = progressByProject[project._id] ?? 0;
            return (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <GlassCard hover className="flex h-full flex-col p-0 overflow-hidden">
                  <div className="h-1.5 bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]" />
                  <div className="flex flex-1 flex-col p-4 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link to={`/projects/${project._id}`} className="group block">
                          <h2 className="text-lg font-bold text-white transition group-hover:text-violet-200">{project.name}</h2>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-400">{project.description}</p>
                        </Link>
                        <div className="mt-4">
                          <div className="mb-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            <span>Progress</span>
                            <span className="text-cyan-300">{pct}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]"
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </div>
                      {isAdmin && (
                        <button
                          type="button"
                          className="btn-danger shrink-0 !px-3 !py-2"
                          onClick={() => deleteProject(project._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="mt-6">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Members</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {project.members?.length ? (
                          project.members.map((member) => (
                            <span
                              key={member._id}
                              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200"
                            >
                              {member.name}
                              {isAdmin && (
                                <button
                                  type="button"
                                  className="text-slate-500 transition hover:text-red-300"
                                  onClick={() => removeMember(project._id, member._id)}
                                  aria-label={`Remove ${member.name}`}
                                >
                                  ×
                                </button>
                              )}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-500">No members yet</span>
                        )}
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
                        <div className="relative">
                          <UserPlus className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                          <input
                            className="form-input pl-10"
                            type="email"
                            placeholder="member@email.com"
                            value={memberEmails[project._id] || ""}
                            onChange={(e) => setMemberEmails({ ...memberEmails, [project._id]: e.target.value })}
                          />
                        </div>
                        <Button type="button" variant="secondary" onClick={() => addMember(project._id)}>
                          Add
                        </Button>
                      </div>
                    )}

                    <div className="mt-6">
                      <Link
                        to={`/projects/${project._id}`}
                        className="text-sm font-semibold text-violet-300 transition hover:text-white"
                      >
                        Open project overview →
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Projects;
