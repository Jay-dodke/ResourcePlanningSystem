import {useEffect, useState} from "react";
import {listTimesheets, createTimesheet, updateTimesheet} from "../../../services/timesheets.service";
import {listProjects} from "../../../services/projects.service";
import {listTasks} from "../../../services/tasks.service";
import PageHeader from "../../../components/ui/PageHeader/PageHeader";
import Button from "../../../components/ui/Button/Button";
import DataTable from "../../../components/tables/DataTable/DataTable";
import Badge from "../../../components/ui/Badge/Badge";
import {useAuthStore} from "../../../store/useAuthStore";
import {useUiStore} from "../../../store/useUiStore";
import Alert from "../../../components/ui/Alert/Alert";
import {getErrorMessage} from "../../../utils/errors";

const TimesheetsPage = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({projectId: "", taskId: "", workDate: "", hours: 8, notes: ""});
  const user = useAuthStore((state) => state.user);
  const roleName = user?.role || user?.roleId?.name || user?.roleId;
  const isAdmin = roleName?.toLowerCase() === "admin";
  const [error, setError] = useState("");
  const pushToast = useUiStore((state) => state.pushToast);

  const fetchTimesheets = () => {
    setLoading(true);
    listTimesheets({limit: 20})
      .then((res) => setTimesheets(res.data.items || []))
      .catch((err) => {
        setTimesheets([]);
        setError(getErrorMessage(err, "Unable to load timesheets"));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTimesheets();
    listProjects({limit: 200}).then((res) => setProjects(res.data.items || [])).catch(() => setProjects([]));
    listTasks({limit: 200}).then((res) => setTasks(res.data.items || [])).catch(() => setTasks([]));
  }, []);

  const updateField = (field) => (event) => {
    setForm((prev) => ({...prev, [field]: event.target.value}));
  };

  const submitTimesheet = async (event) => {
    event.preventDefault();
    if (!form.projectId || !form.workDate) return;
    try {
      setError("");
      await createTimesheet({
        projectId: form.projectId,
        taskId: form.taskId || undefined,
        workDate: new Date(form.workDate).toISOString(),
        hours: Number(form.hours),
        notes: form.notes,
      });
      pushToast({type: "success", message: "Timesheet submitted"});
      setForm({projectId: "", taskId: "", workDate: "", hours: 8, notes: ""});
      fetchTimesheets();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to submit timesheet"));
    }
  };

  const approveTimesheet = async (id, status) => {
    try {
      setError("");
      await updateTimesheet(id, {status});
      pushToast({type: "success", message: `Timesheet ${status}`});
      fetchTimesheets();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update timesheet"));
    }
  };

  const columns = [
    {key: "employee", label: "Employee", render: (row) => row.employeeId?.name || "-"},
    {key: "project", label: "Project", render: (row) => row.projectId?.name || "-"},
    {key: "task", label: "Task", render: (row) => row.taskId?.title || "-"},
    {key: "date", label: "Date", render: (row) => new Date(row.workDate).toLocaleDateString()},
    {key: "hours", label: "Hours", render: (row) => row.hours},
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge tone={row.status === "approved" ? "success" : row.status === "rejected" ? "danger" : "warning"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) =>
        isAdmin ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => approveTimesheet(row._id, "approved")}>
              Approve
            </Button>
            <Button variant="ghost" onClick={() => approveTimesheet(row._id, "rejected")}>
              Reject
            </Button>
          </div>
        ) : (
          "-"
        ),
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <PageHeader eyebrow="Operations" title="Timesheets" />
      <form className="panel p-5 grid gap-3 md:grid-cols-5" onSubmit={submitTimesheet}>
        <select className="ghost-input" value={form.projectId} onChange={updateField("projectId")}>
          <option value="">Project</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
        <select className="ghost-input" value={form.taskId} onChange={updateField("taskId")}>
          <option value="">Task (optional)</option>
          {tasks.map((task) => (
            <option key={task._id} value={task._id}>
              {task.title}
            </option>
          ))}
        </select>
        <input className="ghost-input" type="date" value={form.workDate} onChange={updateField("workDate")} />
        <input className="ghost-input" type="number" min="0" max="24" value={form.hours} onChange={updateField("hours")} />
        <Button type="submit" variant="primary">Log hours</Button>
        <textarea
          className="ghost-input md:col-span-5"
          placeholder="Notes"
          value={form.notes}
          onChange={updateField("notes")}
        />
      </form>
      <DataTable
        columns={columns}
        rows={timesheets}
        emptyState={loading ? "Loading timesheets..." : "No timesheet entries."}
      />
      {error ? <Alert tone="error">{error}</Alert> : null}
    </section>
  );
};

export default TimesheetsPage;



