import {useEffect, useState} from "react";
import {useSearchParams, useNavigate} from "react-router-dom";
import PageHeader from "../../../components/ui/PageHeader/PageHeader";
import Button from "../../../components/ui/Button/Button";
import {globalSearch} from "../../../services/search.service";
import Alert from "../../../components/ui/Alert/Alert";
import {getErrorMessage} from "../../../utils/errors";

const SearchPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(params.get("q") || "");
  const [results, setResults] = useState({users: [], projects: [], tasks: []});
  const [error, setError] = useState("");

  const runSearch = (term) => {
    if (!term) {
      setResults({users: [], projects: [], tasks: []});
      return;
    }
    globalSearch({q: term, limit: 5})
      .then((res) => {
        setError("");
        setResults(res.data.data || {users: [], projects: [], tasks: []});
      })
      .catch((err) => {
        setResults({users: [], projects: [], tasks: []});
        setError(getErrorMessage(err, "Unable to search right now"));
      });
  };

  useEffect(() => {
    const term = params.get("q") || "";
    setQuery(term);
    runSearch(term);
  }, [params]);

  return (
    <section className="flex flex-col gap-4">
      <PageHeader eyebrow="Navigate" title="Global search" />
      <div className="panel p-4 flex flex-col gap-3 md:flex-row md:items-center">
        <input
          className="ghost-input flex-1"
          placeholder="Search employees, projects, tasks"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Button variant="primary" onClick={() => navigate(`/search?q=${encodeURIComponent(query)}`)}>
          Search
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel p-4">
          <h3 className="text-sm font-semibold">Employees</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-secondary">
            {results.users.map((user) => (
              <li key={user._id}>{user.name} · {user.email}</li>
            ))}
            {results.users.length === 0 ? <li>No employees found.</li> : null}
          </ul>
        </div>
        <div className="panel p-4">
          <h3 className="text-sm font-semibold">Projects</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-secondary">
            {results.projects.map((project) => (
              <li key={project._id}>{project.name} · {project.clientName}</li>
            ))}
            {results.projects.length === 0 ? <li>No projects found.</li> : null}
          </ul>
        </div>
        <div className="panel p-4">
          <h3 className="text-sm font-semibold">Tasks</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-secondary">
            {results.tasks.map((task) => (
              <li key={task._id}>{task.title} · {task.projectId?.name || "-"}</li>
            ))}
            {results.tasks.length === 0 ? <li>No tasks found.</li> : null}
          </ul>
        </div>
      </div>
      {error ? <Alert tone="error">{error}</Alert> : null}
    </section>
  );
};

export default SearchPage;



