import {useCallback, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {listProjects} from "../../../services/projects.service";
import DataTable from "../../../components/tables/DataTable/DataTable";
import PageHeader from "../../../components/ui/PageHeader/PageHeader";
import Button from "../../../components/ui/Button/Button";
import Badge from "../../../components/ui/Badge/Badge";
import Alert from "../../../components/ui/Alert/Alert";
import {getErrorMessage} from "../../../utils/errors";
import {useAuthStore} from "../../../store/useAuthStore";

const ProjectList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useAuthStore((state) => state.user);
  const roleName = user?.role || user?.roleId?.name || user?.roleId;
  const isAdmin = roleName?.toLowerCase() === "admin";
  const searchRef = useRef(search);

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  const fetchProjects = useCallback(() => {
    setLoading(true);
    listProjects({limit: 20, search: searchRef.current})
      .then((res) => {
        setError("");
        setProjects(res.data.items || []);
      })
      .catch((err) => {
        setProjects([]);
        setError(getErrorMessage(err, "Unable to load projects"));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const columns = [
    {key: "name", label: "Project"},
    {key: "clientName", label: "Client"},
    {
      key: "manager",
      label: "Manager",
      render: (row) => row.managerId?.name || "-",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge tone={row.status === "active" ? "success" : "warning"}>{row.status}</Badge>
      ),
    },
    {key: "priority", label: "Priority"},
    {
      key: "actions",
      label: "Actions",
      render: (row) =>
        isAdmin ? (
          <Button variant="ghost" onClick={() => navigate(`/projects/${row._id}/edit`)}>
            Edit
          </Button>
        ) : (
          "-"
        ),
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        eyebrow="Delivery"
        title="Projects"
        action={
          isAdmin ? (
            <Button variant="primary" onClick={() => navigate("/projects/new")}>
              New project
            </Button>
          ) : null
        }
      />
      <div className="panel p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            className="ghost-input sm:max-w-xs"
            placeholder="Search projects"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={fetchProjects}>
              Search
            </Button>
            {isAdmin ? <Button variant="ghost">Timeline</Button> : null}
          </div>
        </div>
      </div>
      <DataTable
        columns={columns}
        rows={projects}
        emptyState={loading ? "Loading projects..." : "No projects found."}
      />
      {error ? <Alert tone="error">{error}</Alert> : null}
    </section>
  );
};

export default ProjectList;
