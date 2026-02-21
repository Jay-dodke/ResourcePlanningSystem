import {useEffect, useState} from "react";
import Button from "../../../shared/ui/Button";
import {listUsers} from "../../employees/employees.service";
import {listProjects} from "../../projects/projects.service";

const AllocationForm = ({onSubmit, loading}) => {
  const [form, setForm] = useState({
    employeeId: "",
    projectId: "",
    role: "",
    allocationPercent: 50,
    billable: true,
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState({});
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    listUsers({limit: 200}).then((res) => setEmployees(res.data.items || [])).catch(() => setEmployees([]));
    listProjects({limit: 200}).then((res) => setProjects(res.data.items || [])).catch(() => setProjects([]));
  }, []);

  const updateField = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((prev) => ({...prev, [field]: value}));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.employeeId) nextErrors.employeeId = "Employee is required";
    if (!form.projectId) nextErrors.projectId = "Project is required";
    if (!form.role) nextErrors.role = "Role is required";
    if (!form.startDate) nextErrors.startDate = "Start date is required";
    if (!form.endDate) nextErrors.endDate = "End date is required";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      employeeId: form.employeeId,
      projectId: form.projectId,
      role: form.role,
      allocationPercent: Number(form.allocationPercent),
      billable: Boolean(form.billable),
      startDate: form.startDate,
      endDate: form.endDate,
    });
  };

  return (
    <form className="panel p-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-secondary">Employee</label>
          <select className="ghost-input mt-2" value={form.employeeId} onChange={updateField("employeeId")}>
            <option value="">Select employee</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name} ({employee.designation || ""})
              </option>
            ))}
          </select>
          {errors.employeeId ? <p className="mt-1 text-xs text-danger">{errors.employeeId}</p> : null}
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
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-secondary">Role</label>
          <input className="ghost-input mt-2" value={form.role} onChange={updateField("role")} />
          {errors.role ? <p className="mt-1 text-xs text-danger">{errors.role}</p> : null}
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-secondary">Allocation %</label>
          <input
            className="ghost-input mt-2"
            type="number"
            min="0"
            max="100"
            value={form.allocationPercent}
            onChange={updateField("allocationPercent")}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-secondary">Start date</label>
          <input
            className="ghost-input mt-2"
            type="datetime-local"
            value={form.startDate}
            onChange={updateField("startDate")}
          />
          {errors.startDate ? <p className="mt-1 text-xs text-danger">{errors.startDate}</p> : null}
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-secondary">End date</label>
          <input
            className="ghost-input mt-2"
            type="datetime-local"
            value={form.endDate}
            onChange={updateField("endDate")}
          />
          {errors.endDate ? <p className="mt-1 text-xs text-danger">{errors.endDate}</p> : null}
        </div>
        <label className="flex items-center gap-2 text-sm text-secondary">
          <input type="checkbox" checked={form.billable} onChange={updateField("billable")} />
          Billable assignment
        </label>
      </div>
      <div className="mt-6 flex justify-end">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Saving..." : "Assign"}
        </Button>
      </div>
    </form>
  );
};

export default AllocationForm;







