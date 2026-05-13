import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  title: "",
  description: "",
  project: "",
  assignedTo: "",
  priority: "Medium",
  status: "Todo",
  dueDate: ""
};

const TaskModal = ({ open, onClose, mode = "create", task = null, projects, onSaved }) => {
  const { request, isAdmin } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);

  const selectedProject = useMemo(() => projects.find((p) => p._id === form.project), [projects, form.project]);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && task) {
      const due = task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : "";
      setForm({
        title: task.title || "",
        description: task.description || "",
        project: task.project?._id || task.project || "",
        assignedTo: task.assignedTo?._id || task.assignedTo || "",
        priority: task.priority || "Medium",
        status: task.status || "Todo",
        dueDate: due
      });
    } else {
      setForm(initialForm);
    }
  }, [open, mode, task]);

  const submit = async (event) => {
    event.preventDefault();
    if (!isAdmin) return;
    setSaving(true);
    try {
      if (mode === "create") {
        await request("/api/tasks", { method: "POST", body: JSON.stringify(form) });
        toast.success("Task created");
      } else if (task?._id) {
        await request(`/api/tasks/${task._id}`, {
          method: "PUT",
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            priority: form.priority,
            status: form.status,
            dueDate: form.dueDate,
            assignedTo: form.assignedTo
          })
        });
        toast.success("Task updated");
      }
      onSaved?.();
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      wide
      title={mode === "create" ? "Create task" : "Edit task"}
      description="Keep ownership, dates, and priority visible for every handoff."
    >
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="form-label">Title</label>
          <input
            className="form-input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="form-label">Description</label>
          <textarea
            className="form-input min-h-[100px] resize-y"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="form-label">Project</label>
          <select
            className="form-input"
            value={form.project}
            onChange={(e) => setForm({ ...form, project: e.target.value, assignedTo: "" })}
            required
            disabled={mode === "edit"}
          >
            <option value="">Select project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Assignee</label>
          <select
            className="form-input"
            value={form.assignedTo}
            onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
            required
            disabled={!selectedProject}
          >
            <option value="">Select assignee</option>
            {selectedProject?.members?.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} ({m.email})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Priority</label>
          <select className="form-input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div>
          <label className="form-label">Status</label>
          <select className="form-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option>Todo</option>
            <option>In Progress</option>
            <option>Done</option>
            <option>Overdue</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="form-label">Due date</label>
          <input className="form-input" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
        </div>
        <div className="flex flex-wrap justify-end gap-3 sm:col-span-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : mode === "create" ? "Create task" : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;
