import {useState} from "react";
import Button from "../../../components/ui/Button/Button";

const ProjectForm = ({initialValues, managers = [], onSubmit, loading}) => {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const updateField = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({...prev, [field]: value}));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name) nextErrors.name = "Project name is required";
    if (!form.clientName) nextErrors.clientName = "Client is required";
    if (!form.startDate) nextErrors.startDate = "Start date is required";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      name: form.name,
      clientName: form.clientName,
      status: form.status || "planned",
      priority: form.priority || "medium",
      startDate: form.startDate,
      endDate: form.endDate || undefined,
      managerId: form.managerId || undefined,
    });
  };

  return (
    <form className="panel p-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-secondary">
            Project name
          </label>
          <input className="ghost-input mt-2" value={form.name} onChange={updateField("name")} />
          {errors.name ? <p className="mt-1 text-xs text-danger">{errors.name}</p> : null}
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-secondary">
            Client
          </label>
          <input
            className="ghost-input mt-2"
            value={form.clientName}
            onChange={updateField("clientName")}
          />
          {errors.clientName ? (
            <p className="mt-1 text-xs text-danger">{errors.clientName}</p>
          ) : null}
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-secondary">Status</label>
          <select className="ghost-input mt-2" value={form.status} onChange={updateField("status")}>
            <option value="planned">Planned</option>
            <option value="active">Active</option>
            <option value="on-hold">On hold</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-secondary">Manager</label>
          <select className="ghost-input mt-2" value={form.managerId || ""} onChange={updateField("managerId")}>
            <option value="">Select manager</option>
            {managers.map((manager) => (
              <option key={manager._id} value={manager._id}>
                {manager.name}
              </option>
            ))}
          </select>
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
          <label className="text-xs uppercase tracking-[0.2em] text-secondary">Start date</label>
          <input
            className="ghost-input mt-2"
            type="datetime-local"
            value={form.startDate}
            onChange={updateField("startDate")}
          />
          {errors.startDate ? (
            <p className="mt-1 text-xs text-danger">{errors.startDate}</p>
          ) : null}
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-secondary">End date</label>
          <input
            className="ghost-input mt-2"
            type="datetime-local"
            value={form.endDate || ""}
            onChange={updateField("endDate")}
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Saving..." : "Save Project"}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;



