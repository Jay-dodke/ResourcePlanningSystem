import {useCallback, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {listUsers, updateUser} from "../../../services/users.service";
import {listAvailability} from "../../../services/availability.service";
import DataTable from "../../../components/tables/DataTable/DataTable";
import PageHeader from "../../../components/ui/PageHeader/PageHeader";
import Button from "../../../components/ui/Button/Button";
import Badge from "../../../components/ui/Badge/Badge";
import Alert from "../../../components/ui/Alert/Alert";
import {getErrorMessage} from "../../../utils/errors";
import {useUiStore} from "../../../store/useUiStore";
import {useAvatarStore} from "../../../store/useAvatarStore";
import Avatar from "../../../components/ui/Avatar/Avatar";

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [error, setError] = useState("");
  const pushToast = useUiStore((state) => state.pushToast);
  const avatarOverrides = useAvatarStore((state) => state.overrides);
  const searchRef = useRef(search);

  useEffect(() => {
    searchRef.current = search;
  }, [search]);


  const fetchEmployees = useCallback(() => {
    setLoading(true);
    Promise.all([listUsers({limit: 20, search: searchRef.current}), listAvailability({limit: 200})])
      .then(([usersRes, availabilityRes]) => {
        setError("");
        const items = usersRes.data.items || [];
        setEmployees(items);
        const map = {};
        (availabilityRes.data.items || []).forEach((entry) => {
          if (entry.employeeId?._id) {
            map[entry.employeeId._id] = entry;
          }
        });
        setAvailabilityMap(map);
      })
      .catch((err) => {
        setEmployees([]);
        setAvailabilityMap({});
        setError(getErrorMessage(err, "Unable to load employees"));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const toggleStatus = async (employee) => {
    const nextStatus = employee.status === "active" ? "inactive" : "active";
    setUpdatingId(employee._id);
    try {
      await updateUser(employee._id, {status: nextStatus});
      pushToast({type: "success", message: `Employee ${nextStatus}`});
      fetchEmployees();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update employee"));
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={avatarOverrides[row._id] || row.avatar} name={row.name} size="md" />
          <div>
            <p className="text-sm font-semibold text-primary">{row.name}</p>
            <p className="text-xs text-secondary">{row.email}</p>
          </div>
        </div>
      ),
    },
    {key: "designation", label: "Designation"},
    {key: "department", label: "Department", render: (row) => row.departmentId?.name || "-"},
    {key: "manager", label: "Manager", render: (row) => row.managerId?.name || "-"},
    {
      key: "skills",
      label: "Skills",
      render: (row) =>
        (row.skills || [])
          .map((skill) => (typeof skill === "string" ? skill : skill.name))
          .filter(Boolean)
          .slice(0, 3)
          .join(", ") || "-",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge
          tone={row.status === "active" ? "success" : row.status === "suspended" ? "danger" : "warning"}
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: "availability",
      label: "Availability",
      render: (row) => {
        const entry = availabilityMap[row._id];
        if (!entry) return "Unknown";
        return `${entry.availablePercent}% (${entry.workloadStatus})`;
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => navigate(`/employees/${row._id}`)}>
            View
          </Button>
          <Button variant="ghost" onClick={() => navigate(`/employees/${row._id}/edit`)}>
            Edit
          </Button>
          <Button
            variant="outline"
            disabled={updatingId === row._id}
            onClick={() => toggleStatus(row)}
          >
            {row.status === "active" ? "Deactivate" : "Activate"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        eyebrow="People"
        title="Employees"
        action={
          <Button variant="primary" onClick={() => navigate("/employees/new")}>
            Add employee
          </Button>
        }
      />
      <div className="panel p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            className="ghost-input sm:max-w-xs"
            placeholder="Search by name or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={fetchEmployees}>
              Search
            </Button>
            <Button variant="ghost">Export</Button>
          </div>
        </div>
      </div>
      <DataTable
        columns={columns}
        rows={employees}
        emptyState={loading ? "Loading employees..." : "No employees found."}
      />
      {error ? <Alert tone="error">{error}</Alert> : null}
    </section>
  );
};

export default EmployeeList;



