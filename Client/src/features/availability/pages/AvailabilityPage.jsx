import {useCallback, useEffect, useRef, useState} from "react";
import {listAvailability} from "../../availability/availability.service";
import DataTable from "../../../shared/components/DataTable";
import PageHeader from "../../../shared/ui/PageHeader";
import Button from "../../../shared/ui/Button";
import Badge from "../../../shared/ui/Badge";
import Alert from "../../../shared/ui/Alert";
import {getErrorMessage} from "../../../shared/utils/errors";
import Avatar from "../../../shared/ui/Avatar";
import {useAvatarStore} from "../../../store/useAvatarStore";

const AvailabilityPage = () => {
  const [availability, setAvailability] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    skill: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const avatarOverrides = useAvatarStore((state) => state.overrides);
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);


  const fetchAvailability = useCallback((overrideFilters) => {
    setLoading(true);
    const activeFilters = overrideFilters || filtersRef.current;
    const params = {
      limit: 20,
      search: activeFilters.search || undefined,
      role: activeFilters.role || undefined,
      skill: activeFilters.skill || undefined,
      workloadStatus: activeFilters.status || undefined,
    };

    listAvailability(params)
      .then((res) => {
        setError("");
        setAvailability(res.data.items || []);
      })
      .catch((err) => {
        setAvailability([]);
        setError(getErrorMessage(err, "Unable to load availability"));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

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
    {key: "capacity", label: "Capacity", render: (row) => `${row.capacityPercent}%`},
    {key: "available", label: "Available", render: (row) => `${row.availablePercent}%`},
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge
          tone={
            row.workloadStatus === "available"
              ? "success"
              : row.workloadStatus === "overloaded"
                ? "danger"
                : "warning"
          }
        >
          {row.workloadStatus}
        </Badge>
      ),
    },
    {
      key: "leave",
      label: "Leave",
      render: (row) => (row.onLeave ? "On leave" : "-"),
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <PageHeader
        eyebrow="Capacity"
        title="Availability & workload"
        action={<Button variant="primary">Update capacity</Button>}
      />
      <div className="panel p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            className="ghost-input"
            placeholder="Search by name or email"
            value={filters.search}
            onChange={updateFilter("search")}
          />
          <input
            className="ghost-input"
            placeholder="Filter by role"
            value={filters.role}
            onChange={updateFilter("role")}
          />
          <input
            className="ghost-input"
            placeholder="Filter by skill"
            value={filters.skill}
            onChange={updateFilter("skill")}
          />
          <select className="ghost-input" value={filters.status} onChange={updateFilter("status")}>
            <option value="">All statuses</option>
            <option value="available">Available</option>
            <option value="partial">Partial</option>
            <option value="overloaded">Overloaded</option>
          </select>
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button variant="outline" onClick={fetchAvailability}>
            Apply filters
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              const cleared = {search: "", role: "", skill: "", status: ""};
              setFilters(cleared);
              fetchAvailability(cleared);
            }}
          >
            Reset
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        rows={availability}
        emptyState={loading ? "Loading availability..." : "No availability data."}
      />
      {error ? <Alert tone="error">{error}</Alert> : null}
    </section>
  );
};

export default AvailabilityPage;







