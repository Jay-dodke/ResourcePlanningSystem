import {useEffect, useMemo, useState} from "react";
import PageHeader from "../../../components/ui/PageHeader/PageHeader";
import Card from "../../../components/ui/Card/Card";
import UtilizationChart from "../../../components/charts/UtilizationChart/UtilizationChart";
import DataTable from "../../../components/tables/DataTable/DataTable";
import Badge from "../../../components/ui/Badge/Badge";
import Alert from "../../../components/ui/Alert/Alert";
import {getPlanningSummary} from "../../../services/planning.service";
import {getErrorMessage} from "../../../utils/errors";

const EmployeeWorkspace = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getPlanningSummary({weeks: 8})
      .then((res) => {
        setError("");
        setSummary(res.data.data);
      })
      .catch((err) => {
        setSummary(null);
        setError(getErrorMessage(err, "Unable to load planning summary"));
      });
  }, []);

  const allocations = summary?.allocations || [];
  const upcomingTasks = summary?.upcomingTasks || [];
  const deadlines = summary?.deadlines || [];
  const conflicts = summary?.conflicts || [];
  const availability = summary?.availability;
  const leaves = summary?.leaves || [];
  const upcomingAllocationEnd = summary?.upcomingAllocationEnd;

  const chartData = useMemo(() => {
    const timelineData = summary?.timeline || [];
    return timelineData.map((period) => ({
      label: period.label,
      value: period.totalAllocation,
    }));
  }, [summary?.timeline]);

  const allocationColumns = [
    {key: "project", label: "Project", render: (row) => row.projectId?.name || "-"},
    {key: "role", label: "Role", render: (row) => row.role || "-"},
    {key: "allocation", label: "Allocation", render: (row) => `${row.allocationPercent}%`},
    {
      key: "dates",
      label: "Dates",
      render: (row) =>
        row.startDate && row.endDate
          ? `${new Date(row.startDate).toLocaleDateString()} - ${new Date(row.endDate).toLocaleDateString()}`
          : "-",
    },
  ];

  const taskColumns = [
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
    {
      key: "due",
      label: "Due",
      render: (row) => (row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "-"),
    },
  ];

  const deadlineColumns = [
    {key: "title", label: "Task"},
    {key: "project", label: "Project", render: (row) => row.projectId?.name || "-"},
    {
      key: "due",
      label: "Due",
      render: (row) => (row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "-"),
    },
  ];

  const conflictColumns = [
    {
      key: "period",
      label: "Week",
      render: (row) =>
        row.periodStart && row.periodEnd
          ? `${new Date(row.periodStart).toLocaleDateString()} - ${new Date(row.periodEnd).toLocaleDateString()}`
          : "-",
    },
    {key: "allocation", label: "Total allocation", render: (row) => `${row.totalAllocation}%`},
    {key: "capacity", label: "Capacity", render: (row) => `${row.capacityPercent}%`},
    {
      key: "utilization",
      label: "Utilization",
      render: (row) => `${row.utilizationPercent}%`,
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <PageHeader eyebrow="Planning" title="My Planning Workspace" />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 min-[1440px]:grid-cols-4">
        <Card
          title="Current utilization"
          value={`${summary?.utilization?.current ?? "--"}%`}
          meta="This week"
        />
        <Card
          title="Average utilization"
          value={`${summary?.utilization?.average ?? "--"}%`}
          meta="Next 8 weeks"
        />
        <Card
          title="Active allocations"
          value={allocations.length || 0}
          meta="Assignments"
        />
        <Card
          title="Conflicts"
          value={conflicts.length || 0}
          meta={conflicts.length ? "Attention needed" : "All clear"}
        />
      </section>

      <UtilizationChart data={chartData} />

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="mb-3 text-lg font-semibold">My allocations</h3>
            <DataTable columns={allocationColumns} rows={allocations} emptyState="No allocations scheduled." />
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold">Upcoming tasks</h3>
            <DataTable columns={taskColumns} rows={upcomingTasks} emptyState="No upcoming tasks." />
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold">Deadlines (next 2 weeks)</h3>
            <DataTable columns={deadlineColumns} rows={deadlines} emptyState="No urgent deadlines." />
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold">Workload conflicts</h3>
            <DataTable columns={conflictColumns} rows={conflicts} emptyState="No conflicts detected." />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="panel p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary">Availability</p>
            <p className="mt-3 text-2xl font-semibold">
              {availability ? `${availability.availablePercent}%` : "--"}
            </p>
            <Badge
              className="mt-3"
              tone={
                availability?.workloadStatus === "available"
                  ? "success"
                  : availability?.workloadStatus === "overloaded"
                    ? "danger"
                    : "warning"
              }
            >
              {availability?.workloadStatus || "unknown"}
            </Badge>
          </div>

          <div className="panel p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary">Leave & time off</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-secondary">
              {leaves.length === 0 ? <span>No leave scheduled.</span> : null}
              {leaves.slice(0, 3).map((leave) => (
                <div key={leave._id} className="flex items-center justify-between">
                  <span>{leave.type}</span>
                  <span>
                    {new Date(leave.startDate).toLocaleDateString()} -{" "}
                    {new Date(leave.endDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary">Next allocation end</p>
            <p className="mt-3 text-lg font-semibold">
              {upcomingAllocationEnd?.date
                ? new Date(upcomingAllocationEnd.date).toLocaleDateString()
                : "No upcoming end date"}
            </p>
            <p className="text-sm text-secondary">
              {upcomingAllocationEnd?.project?.name || "—"}
            </p>
          </div>
        </div>
      </section>

      {error ? <Alert tone="error">{error}</Alert> : null}
    </section>
  );
};

export default EmployeeWorkspace;
