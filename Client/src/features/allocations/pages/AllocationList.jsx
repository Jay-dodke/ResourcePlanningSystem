import {useCallback, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {listAllocations} from "../../allocations/allocations.service";
import {listUsers} from "../../employees/employees.service";
import {listProjects} from "../../projects/projects.service";
import DataTable from "../../../shared/components/DataTable";
import PageHeader from "../../../shared/ui/PageHeader";
import Button from "../../../shared/ui/Button";
import Alert from "../../../shared/ui/Alert";
import {getErrorMessage} from "../../../shared/utils/errors";
import Avatar from "../../../shared/ui/Avatar";
import {useAuthStore} from "../../../store/useAuthStore";
import {useAvatarStore} from "../../../store/useAvatarStore";

const AllocationList = () => {
  const navigate = useNavigate();
  const [allocations, setAllocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({employeeId: "", projectId: ""});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useAuthStore((state) => state.user);
  const roleName = user?.role || user?.roleId?.name || user?.roleId;
  const isAdmin = roleName?.toLowerCase() === "admin";
  const avatarOverrides = useAvatarStore((state) => state.overrides);
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchAllocations = useCallback((overrideFilters) => {
    setLoading(true);
    const activeFilters = overrideFilters || filtersRef.current;
    listAllocations({
      limit: 20,
      employeeId: activeFilters.employeeId || undefined,
      projectId: activeFilters.projectId || undefined,
    })
      .then((res) => {
        setError("");
        setAllocations(res.data.items || []);
      })
      .catch((err) => {
        setAllocations([]);
        setError(getErrorMessage(err, "Unable to load allocations"));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchAllocations();
    listUsers({limit: 200})
      .then((res) => setEmployees(res.data.items || []))
      .catch(() => setEmployees([]));
    listProjects({limit: 200})
      .then((res) => setProjects(res.data.items || []))
      .catch(() => setProjects([]));
  }, [fetchAllocations]);

  const updateFilter = (field) => (event) => {
    setFilters((prev) => ({...prev, [field]: event.target.value}));
  };

  const columns = [
    {
      key: "employee",
      label: "Employee",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar
            src={avatarOverrides[row.employeeId?._id] || row.employeeId?.avatar}
            name={row.employeeId?.name}
            size="sm"
          />
          <span>{row.employeeId?.name}</span>
        </div>
      ),
    },
    {key: "project", label: "Project", render: (row) => row.projectId?.name},
    {key: "role", label: "Role", render: (row) => row.role},
    {key: "allocation", label: "Allocation %", render: (row) => `${row.allocationPercent}%`},
    {key: "billable", label: "Billable", render: (row) => (row.billable ? "Yes" : "No")},
    {
      key: "dates",
      label: "Dates",
      render: (row) =>
        row.startDate && row.endDate
          ? `${new Date(row.startDate).toLocaleDateString()} - ${new Date(row.endDate).toLocaleDateString()}`
          : "-",
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        eyebrow="Delivery"
        title="Resource allocations"
        action={
          isAdmin ? (
            <Button variant="primary" onClick={() => navigate("/allocations/new")}>
              Assign resource
            </Button>
          ) : null
        }
      />
      <div className="panel p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <select
            className="ghost-input"
            value={filters.employeeId}
            onChange={updateFilter("employeeId")}
          >
            <option value="">All employees</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name}
              </option>
            ))}
          </select>
          <select
            className="ghost-input"
            value={filters.projectId}
            onChange={updateFilter("projectId")}
          >
            <option value="">All projects</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => fetchAllocations(filters)}>
              Apply filters
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                const cleared = {employeeId: "", projectId: ""};
                setFilters(cleared);
                fetchAllocations(cleared);
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
      <DataTable
        columns={columns}
        rows={allocations}
        emptyState={loading ? "Loading allocations..." : "No allocations found."}
      />
      {error ? <Alert tone="error">{error}</Alert> : null}
    </section>
  );
};

export default AllocationList;




