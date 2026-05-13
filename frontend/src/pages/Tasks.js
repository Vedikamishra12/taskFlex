import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Filter, LayoutGrid, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Badge from "../components/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import TaskModal from "../components/TaskModal";
import { useAuth } from "../context/AuthContext";

const COLUMNS = ["Todo", "In Progress", "Done", "Overdue"];

const Tasks = () => {
  const { isAdmin, request } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingTask, setEditingTask] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [taskData, projectData] = await Promise.all([request("/api/tasks"), request("/api/projects")]);
      setTasks(taskData);
      setProjects(projectData);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      if (priorityFilter && t.priority !== priorityFilter) return false;
      if (projectFilter && (t.project?._id || t.project) !== projectFilter) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.project?.name || "").toLowerCase().includes(q)
      );
    });
  }, [tasks, query, priorityFilter, projectFilter]);

  const grouped = useMemo(() => {
    const map = { Todo: [], "In Progress": [], Done: [], Overdue: [] };
    filteredTasks.forEach((t) => {
      if (map[t.status]) map[t.status].push(t);
    });
    return map;
  }, [filteredTasks]);

  const updateStatus = async (taskId, status) => {
    try {
      await request(`/api/tasks/${taskId}`, { method: "PUT", body: JSON.stringify({ status }) });
      toast.success("Task updated");
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await request(`/api/tasks/${taskId}`, { method: "DELETE" });
      toast.success("Task deleted");
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openCreate = () => {
    setModalMode("create");
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setModalMode("edit");
    setEditingTask(task);
    setModalOpen(true);
  };

  if (loading) return <LoadingState label="Loading tasks…" skeleton />;

  return (
    <>
      <section className="relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-slate-950 via-indigo-950/50 to-slate-900 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-200/90">Execution</p>
            <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">Kanban-style clarity</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300/90">
              Filter fast, scan columns, and keep status transitions one tap away.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">
              <LayoutGrid className="h-4 w-4 text-violet-300" />
              {filteredTasks.length} visible
            </div>
            {isAdmin && (
              <Button type="button" onClick={openCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                New task
              </Button>
            )}
          </div>
        </div>
      </section>

      <PageHeader
        eyebrow="Board"
        title="Tasks"
        description={isAdmin ? "Create, assign, and monitor work across every project." : "Update the status of tasks assigned to you."}
      />

      <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_1fr_1fr]">
        <div className="relative lg:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input className="form-input pl-10" placeholder="Search tasks…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="relative">
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <select className="form-input pl-10" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">All priorities</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <select className="form-input" value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
          <option value="">All projects</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {tasks.length === 0 ? (
        <EmptyState title="No tasks yet" message={isAdmin ? "Create a task after adding members to a project." : "Assigned tasks will appear here."} />
      ) : (
        <div className="scrollbar-thin -mx-1 flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
          {COLUMNS.map((col) => (
            <div key={col} className="min-w-[280px] flex-1 lg:min-w-0">
              <div className="mb-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-md">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{col}</span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-slate-200">{grouped[col].length}</span>
              </div>
              <div className="space-y-3">
                <AnimatePresence>
                  {grouped[col].map((task) => (
                    <motion.article
                      key={task._id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className={`rounded-3xl border bg-white/[0.04] p-4 shadow-lg backdrop-blur-xl transition-all hover:border-violet-400/30 ${
                        task.status === "Overdue" ? "border-red-400/40 shadow-red-500/10" : "border-white/10"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-bold text-white">{task.title}</h3>
                          <p className="mt-1 line-clamp-2 text-xs text-slate-400">{task.description}</p>
                        </div>
                        {isAdmin && (
                          <div className="flex shrink-0 gap-1">
                            <button
                              type="button"
                              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:text-white"
                              onClick={() => openEdit(task)}
                              aria-label="Edit task"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className="rounded-xl border border-red-500/30 bg-red-500/10 p-2 text-red-200 hover:bg-red-500/20"
                              onClick={() => deleteTask(task._id)}
                              aria-label="Delete task"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge type="priority" value={task.priority} />
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-slate-300">
                          {task.project?.name}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">
                        {task.assignedTo?.name} · Due {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                      <div className="mt-3">
                        <label className="form-label !mb-1 !normal-case !text-[10px]">Status</label>
                        <select className="form-input !py-2 text-xs" value={task.status} onChange={(e) => updateStatus(task._id, e.target.value)}>
                          <option>Todo</option>
                          <option>In Progress</option>
                          <option>Done</option>
                          <option>Overdue</option>
                        </select>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
                {grouped[col].length === 0 && (
                  <div className="rounded-3xl border border-dashed border-white/10 px-3 py-8 text-center text-xs text-slate-500">Drop tasks here</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        task={editingTask}
        projects={projects}
        onSaved={fetchData}
      />
    </>
  );
};

export default Tasks;
