import {useEffect, useState} from "react";
import {listMyTasks, updateTask} from "../../../services/tasks.service";
import PageHeader from "../../../components/ui/PageHeader/PageHeader";
import DataTable from "../../../components/tables/DataTable/DataTable";
import Badge from "../../../components/ui/Badge/Badge";
import Alert from "../../../components/ui/Alert/Alert";
import {getErrorMessage} from "../../../utils/errors";
import Button from "../../../components/ui/Button/Button";
import {useUiStore} from "../../../store/useUiStore";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const pushToast = useUiStore((state) => state.pushToast);

  useEffect(() => {
    setLoading(true);
    listMyTasks({limit: 20})
      .then((res) => {
        setError("");
        setTasks(res.data.items || []);
      })
      .catch((err) => {
        setTasks([]);
        setError(getErrorMessage(err, "Unable to load tasks"));
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (taskId, status) => {
    try {
      setUpdatingId(taskId);
      await updateTask(taskId, {status});
      pushToast({type: "success", message: "Task updated"});
      const response = await listMyTasks({limit: 20});
      setTasks(response.data.items || []);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update task"));
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    {key: "title", label: "Task"},
    {key: "project", label: "Project", render: (row) => row.projectId?.name || "-"},
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
        <div className="flex flex-wrap gap-2">
          {row.status !== "in-progress" ? (
            <Button
              variant="outline"
              disabled={updatingId === row._id}
              onClick={() => updateStatus(row._id, "in-progress")}
            >
              Start
            </Button>
          ) : null}
          {row.status !== "done" ? (
            <Button
              variant="primary"
              disabled={updatingId === row._id}
              onClick={() => updateStatus(row._id, "done")}
            >
              Mark done
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <PageHeader eyebrow="My work" title="My Tasks" />
      <DataTable
        columns={columns}
        rows={tasks}
        emptyState={loading ? "Loading tasks..." : "No tasks assigned."}
      />
      {error ? <Alert tone="error">{error}</Alert> : null}
    </section>
  );
};

export default MyTasks;



