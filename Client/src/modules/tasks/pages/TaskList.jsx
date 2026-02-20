import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {listTasks} from "../../../services/tasks.service";
import DataTable from "../../../components/tables/DataTable/DataTable";
import PageHeader from "../../../components/ui/PageHeader/PageHeader";
import Button from "../../../components/ui/Button/Button";
import Badge from "../../../components/ui/Badge/Badge";
import Alert from "../../../components/ui/Alert/Alert";
import {getErrorMessage} from "../../../utils/errors";
import Avatar from "../../../components/ui/Avatar/Avatar";

const TaskList = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({search: "", status: ""});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = (override) => {
    const activeFilters = override || filters;
    setLoading(true);
    listTasks({
      limit: 20,
      search: activeFilters.search || undefined,
      status: activeFilters.status || undefined,
    })
      .then((res) => {
        setError("");
        setTasks(res.data.items || []);
      })
      .catch((err) => {
        setTasks([]);
        setError(getErrorMessage(err, "Unable to load tasks"));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateFilter = (field) => (event) => {
    setFilters((prev) => ({...prev, [field]: event.target.value}));
  };

  const columns = [
    {key: "title", label: "Task"},
    {key: "project", label: "Project", render: (row) => row.projectId?.name || "-"},
    {
      key: "assignee",
      label: "Assignee",
      render: (row) =>
        row.assigneeId ? (
          <div className="flex items-center gap-2">
            <Avatar src={row.assigneeId?.avatar} name={row.assigneeId?.name} size="sm" />
            <span>{row.assigneeId?.name}</span>
          </div>
        ) : (
          "Unassigned"
        ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge tone={row.status === "done" ? "success" : row.status === "blocked" ? "danger" : "warning"}>
          {row.status}
        </Badge>
      ),
    },
    {key: "priority", label: "Priority"},
    {
      key: "due",
      label: "Due",
      render: (row) => (row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "-")
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <Button variant="ghost" onClick={() => navigate(`/tasks/${row._id}/edit`)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        eyebrow="Delivery"
        title="Tasks"
        action={
          <Button variant="primary" onClick={() => navigate("/tasks/new")}>Create task</Button>
        }
      />
      <div className="panel p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="ghost-input"
            placeholder="Search tasks"
            value={filters.search}
            onChange={updateFilter("search")}
          />
          <select className="ghost-input" value={filters.status} onChange={updateFilter("status")}>
            <option value="">All statuses</option>
            <option value="todo">To do</option>
            <option value="in-progress">In progress</option>
            <option value="blocked">Blocked</option>
            <option value="done">Done</option>
          </select>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => fetchTasks(filters)}>
              Apply filters
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                const cleared = {search: "", status: ""};
                setFilters(cleared);
                fetchTasks(cleared);
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
      <DataTable
        columns={columns}
        rows={tasks}
        emptyState={loading ? "Loading tasks..." : "No tasks found."}
      />
      {error ? <Alert tone="error">{error}</Alert> : null}
    </section>
  );
};

export default TaskList;



