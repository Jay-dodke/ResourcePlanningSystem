import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import TaskForm from "../components/TaskForm";
import PageHeader from "../../../shared/ui/PageHeader";
import Button from "../../../shared/ui/Button";
import {getTask, updateTask} from "../../tasks/tasks.service";
import {useUiStore} from "../../../store/useUiStore";
import Alert from "../../../shared/ui/Alert";
import {getErrorMessage} from "../../../shared/utils/errors";

const TaskEdit = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [error, setError] = useState("");
  const pushToast = useUiStore((state) => state.pushToast);

  useEffect(() => {
    getTask(id)
      .then((res) => {
        const task = res.data.data;
        setInitialValues({
          title: task.title,
          description: task.description || "",
          priority: task.priority || "medium",
          status: task.status || "todo",
          projectId: task.projectId?._id || task.projectId || "",
          assigneeId: task.assigneeId?._id || task.assigneeId || "",
          startDate: task.startDate ? new Date(task.startDate).toISOString().slice(0, 16) : "",
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : "",
        });
      })
      .catch(() => setInitialValues(null));
  }, [id]);

  const handleSubmit = async (payload) => {
    setLoading(true);
    try {
      setError("");
      await updateTask(id, payload);
      pushToast({type: "success", message: "Task updated"});
      navigate("/tasks");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update task"));
    } finally {
      setLoading(false);
    }
  };

  if (!initialValues) {
    return <div className="panel p-6 text-sm text-secondary">Loading task...</div>;
  }

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        eyebrow="Delivery"
        title="Edit task"
        action={
          <Button variant="ghost" onClick={() => navigate("/tasks")}>
            Back to list
          </Button>
        }
      />
      <TaskForm initialValues={initialValues} onSubmit={handleSubmit} loading={loading} />
      {error ? <Alert tone="error">{error}</Alert> : null}
    </section>
  );
};

export default TaskEdit;







