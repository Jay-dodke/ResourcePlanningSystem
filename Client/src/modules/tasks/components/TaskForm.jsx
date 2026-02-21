import {useEffect, useState} from "react";
import Button from "../../../components/ui/Button/Button";
import {listProjects} from "../../../services/projects.service";
import {listUsers} from "../../../services/users.service";

const TaskForm = ({initialValues, onSubmit, loading}) => {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    listProjects({limit: 200})
      .then((res) => setProjects(res.data.items || []))
      .catch(() => setProjects([]));
    listUsers({limit: 200})
      .then((res) => setEmployees(res.data.items || []))
      .catch(() => setEmployees([]));
  }, []);

  const updateField = (field) => (event) => {
    setForm((prev) => ({...prev, [field]: event.target.value}));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.title) nextErrors.title = "Title is required";
    if (!form.projectId) nextErrors.projectId = "Project is required";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      title: form.title,
      description: form.description || "",
      priority: form.priority || "medium",
      status: form.status || "todo",
      startDate: form.startDate || undefined,
      dueDate: form.dueDate || undefined,
      projectId: form.projectId,
      assigneeId: form.assigneeId || undefined,
    });
  };

  return (
    <form className="panel p-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-secondary">Title</label>
          <input className="ghost-input mt-2" value={form.title} onChange={updateField("title")} />
          {errors.title ? <p className="mt-1 text-xs text-danger">{errors.title}</p> : null}
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-secondary">Project</label>
          <select className="ghost-input mt-2" value={form.projectId} onChange={updateField("projectId")}>
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
          {errors.projectId ? <p className="mt-1 text-xs text-danger">{errors.projectId}</p> : null}
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs uppercase tracking-[0.2em] text-secondary">Description</label>
          <textarea
            className="ghost-input mt-2 min-h-[120px]"
            value={form.description || ""}
            onChange={updateField("description")}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-secondary">Priority</label>
          <select className="ghost-input mt-2" value={form.priority} onChange={updateField("priority")}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-secondary">Status</label>
          <select className="ghost-input mt-2" value={form.status} onChange={updateField("status")}>
            <option value="todo">To do</option>
            <option value="in-progress">In progress</option>
            <option value="blocked">Blocked</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-secondary">Assignee</label>
          <select className="ghost-input mt-2" value={form.assigneeId || ""} onChange={updateField("assigneeId")}>
            <option value="">Unassigned</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-secondary">Start date</label>
          <input
            className="ghost-input mt-2"
            type="datetime-local"
            value={form.startDate || ""}
            onChange={updateField("startDate")}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-secondary">Due date</label>
          <input
            className="ghost-input mt-2"
            type="datetime-local"
            value={form.dueDate || ""}
            onChange={updateField("dueDate")}
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Saving..." : "Save task"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;



