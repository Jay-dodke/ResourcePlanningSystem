import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import ProjectForm from "../components/ProjectForm";
import PageHeader from "../../../components/ui/PageHeader/PageHeader";
import Button from "../../../components/ui/Button/Button";
import {getProject, updateProject} from "../../../services/projects.service";
import {listUsers} from "../../../services/users.service";
import {useUiStore} from "../../../store/useUiStore";
import Alert from "../../../components/ui/Alert/Alert";
import {getErrorMessage} from "../../../utils/errors";

const toLocalInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16);
};

const ProjectEdit = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState([]);
  const [error, setError] = useState("");
  const pushToast = useUiStore((state) => state.pushToast);

  useEffect(() => {
    getProject(id)
      .then((res) => {
        const project = res.data.data;
        setInitialValues({
          name: project.name,
          clientName: project.clientName,
          status: project.status,
          priority: project.priority,
          startDate: toLocalInput(project.startDate),
          endDate: toLocalInput(project.endDate),
          managerId: project.managerId?._id || "",
        });
      })
      .catch(() => setInitialValues(null));
  }, [id]);

  useEffect(() => {
    listUsers({limit: 200}).then((res) => setManagers(res.data.items || [])).catch(() => setManagers([]));
  }, []);

  const handleSubmit = async (payload) => {
    try {
      setError("");
      setLoading(true);
      await updateProject(id, payload);
      pushToast({type: "success", message: "Project updated"});
      navigate("/projects");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update project"));
    } finally {
      setLoading(false);
    }
  };

  if (!initialValues) {
    return <div className="panel p-6 text-sm text-secondary">Loading project...</div>;
  }

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        eyebrow="Delivery"
        title="Edit project"
        action={
          <Button variant="ghost" onClick={() => navigate("/projects")}
          >
            Back to list
          </Button>
        }
      />
      <ProjectForm initialValues={initialValues} managers={managers} onSubmit={handleSubmit} loading={loading} />
      {error ? <Alert tone="error">{error}</Alert> : null}
    </section>
  );
};

export default ProjectEdit;



