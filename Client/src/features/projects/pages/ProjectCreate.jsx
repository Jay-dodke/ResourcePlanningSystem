import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import ProjectForm from "../components/ProjectForm";
import PageHeader from "../../../shared/ui/PageHeader";
import Button from "../../../shared/ui/Button";
import {createProject} from "../../projects/projects.service";
import {listUsers} from "../../employees/employees.service";
import {useUiStore} from "../../../store/useUiStore";
import Alert from "../../../shared/ui/Alert";
import {getErrorMessage} from "../../../shared/utils/errors";

const ProjectCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState([]);
  const [error, setError] = useState("");
  const pushToast = useUiStore((state) => state.pushToast);

  useEffect(() => {
    listUsers({limit: 200}).then((res) => setManagers(res.data.items || [])).catch(() => setManagers([]));
  }, []);

  const handleSubmit = async (payload) => {
    try {
      setError("");
      setLoading(true);
      await createProject(payload);
      pushToast({type: "success", message: "Project created"});
      navigate("/projects");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create project"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        eyebrow="Delivery"
        title="Create project"
        action={
          <Button variant="ghost" onClick={() => navigate("/projects")}
          >
            Back to list
          </Button>
        }
      />
      <ProjectForm
        initialValues={{
          name: "",
          clientName: "",
          status: "planned",
          priority: "medium",
          startDate: "",
          endDate: "",
          managerId: "",
        }}
        managers={managers}
        onSubmit={handleSubmit}
        loading={loading}
      />
      {error ? <Alert tone="error">{error}</Alert> : null}
    </section>
  );
};

export default ProjectCreate;







