import {useNavigate} from "react-router-dom";
import {useState} from "react";
import TaskForm from "../components/TaskForm";
import PageHeader from "../../../shared/ui/PageHeader";
import Button from "../../../shared/ui/Button";
import {createTask} from "../../tasks/tasks.service";
import {useUiStore} from "../../../store/useUiStore";
import Alert from "../../../shared/ui/Alert";
import {getErrorMessage} from "../../../shared/utils/errors";

const TaskCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pushToast = useUiStore((state) => state.pushToast);

  const initialValues = {
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    projectId: "",
    assigneeId: "",
    startDate: "",
    dueDate: "",
  };

  const handleSubmit = async (payload) => {
    setLoading(true);
    try {
      setError("");
      await createTask(payload);
      pushToast({type: "success", message: "Task created"});
      navigate("/tasks");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create task"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        eyebrow="Delivery"
        title="Create task"
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

export default TaskCreate;







